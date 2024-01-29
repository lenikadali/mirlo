import styled from "@emotion/styled";
import { bp } from "../../constants";

export function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export function inMirlo() {
  try {
    return window.top?.location.origin === process.env.REACT_APP_CLIENT_DOMAIN;
  } catch (e) {
    return false;
  }
}

export const WidgetWrapper = styled.div<{ embeddedInMirlo?: boolean }>`
  display: flex;
  border: var(--mi-border);
  flex-direction: column;
  width: 100%;
  padding: 0.5rem;
  ${(props) => props.embeddedInMirlo && "min-height: 154px;"}
  display: flex;
  flex-direction: column;
  align-items: space-between;
  justify-content: stretch;
  border-radius: 0.3rem;
  box-sizing: border-box;
  background: var(--mi-normal-background-color);
`;

export const TgWidgetWrapper = styled.div<{ embeddedInMirlo?: boolean }>`
  display: flex;
  gap: 4% 2.5%;
  width: 100%;
  padding: 0.5rem;
  ${(props) => props.embeddedInMirlo && "min-height: 154px;"}
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border-radius: 0.3rem;
  box-sizing: border-box;
  height: 100%;
  table {
    margin: 0;
  }

  @media screen and (max-width: ${bp.small}px) {
    grid-template-columns: repeat(1, 1fr);
    padding: .5rem .5rem 0 .5rem;
    justify-content: center;
    gap: 0;
  }
`;

export const TrackListWrapper = styled.div<{}>`

  border-top: var(--mi-border);
  border-bottom: var(--mi-border);
  background-color: var(--mi-normal-background-color);
  padding-right: 2%;
  overflow: auto;
  max-height: 200px;

  @media screen and (max-width: ${bp.small}px) {
   max-height: 70px;
  }
          
`;
export const WidgetTitleWrapper = styled.div<{}>`

  display: flex;
  flex: 50%;
  max-width: 50%;
  flex-direction: column;
  justify-content: center;
            
  @media screen and (max-width: ${bp.small}px) {
              
    max-width: 100%;             
    flex: 100%;
              
    a {            
      font-size: var(--mi-font-size-small) !important;            
      overflow: hidden;             
      white-space: nowrap;                
      max-width: 100%;               
      display: block;            
      text-overflow: ellipsis;            
    }
}
          
`;

export const FlexWrapper = styled.div`
  display: flex;
`;
