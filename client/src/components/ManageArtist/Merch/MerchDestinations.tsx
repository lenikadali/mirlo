import { useQuery } from "@tanstack/react-query";
import Button from "components/common/Button";
import { queryManagedMerch } from "queries";
import { FaPen, FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";
import DashedList from "./DashedList";
import { css } from "@emotion/css";
import React from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import api from "services/api";
import { useAuthContext } from "state/AuthContext";
import DestinationListItem from "./DestinationListItem";
import countryCodesCurrencies from "./country-codes-currencies";
import styled from "@emotion/styled";

const P = styled.p`
  margin: 0.25rem 0 0.5rem;
`;

type DestinationForm = {
  destinations: Partial<ShippingDestination>[];
};

const currencyToCountryMap = countryCodesCurrencies.reduce(
  (aggr, country) => {
    aggr[country.currencyCode] = country;
    return aggr;
  },
  {} as { [key: string]: any }
);

const MerchDestinations: React.FC<{}> = () => {
  const { merchId: merchParamId } = useParams();
  const { t } = useTranslation("translation", { keyPrefix: "manageMerch" });
  const [isEditing, setIsEditing] = React.useState(false);
  const { user } = useAuthContext();

  const { data: merch, refetch } = useQuery(
    queryManagedMerch(merchParamId ?? "")
  );

  const methods = useForm<DestinationForm>({
    defaultValues: {
      destinations: merch?.shippingDestinations.map((dest) => ({
        ...dest,
        costUnit: dest.costUnit / 100,
        costExtraUnit: dest.costExtraUnit / 100,
      })),
    },
  });

  const { fields, append } = useFieldArray({
    control: methods.control,
    name: `destinations`,
  });

  const update = React.useCallback(
    async (newDestinations: DestinationForm) => {
      const packet = newDestinations.destinations.map((dest) => ({
        ...dest,
        costUnit: Number(dest.costUnit) * 100,
        costExtraUnit: Number(dest.costExtraUnit) * 100,
      }));
      try {
        await api.put(`manage/merch/${merchParamId}/destinations`, packet);
        refetch();
      } catch (e) {
        console.error("e", e);
      }
    },
    [merchParamId, refetch]
  );

  return (
    <>
      <h2
        className={css`
          margin-top: 3rem;
        `}
      >
        {t("shippingDestinationPrices")}
      </h2>
      <P>{t("setDifferentCostPerDestination")}</P>
      {user?.currency && (
        <P>
          {t("currentCountry", {
            country: currencyToCountryMap[user?.currency],
          })}
        </P>
      )}
      <form
        onSubmit={methods.handleSubmit(update)}
        className={css`
          width: 100%;
          margin-top: 0.75rem;
        `}
      >
        <FormProvider {...methods}>
          <DashedList>
            {fields?.map((dest, index) => (
              <DestinationListItem
                dest={dest}
                key={dest.id}
                isEditing={isEditing}
                index={index}
              />
            ))}
          </DashedList>
        </FormProvider>
        <div
          className={css`
            margin-top: 1rem;
          `}
        >
          {!isEditing && (
            <Button startIcon={<FaPen />} onClick={() => setIsEditing(true)}>
              {t("edit")}
            </Button>
          )}
          {isEditing && (
            <>
              <Button
                onClick={() => {
                  append({ destinationCountry: null });
                }}
                type="button"
                compact
                startIcon={<FaPlus />}
                variant="dashed"
              >
                {t("addNewShippingDestination")}
              </Button>
              <Button>{t("save")}</Button>
            </>
          )}
        </div>
      </form>
    </>
  );
};

export default MerchDestinations;