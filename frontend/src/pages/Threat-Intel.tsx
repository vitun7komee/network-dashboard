// import HeuristicIncidentList from "../components/HeuristicIncidentList";

// export default function ThreatIntelPage() {
//   return (
//     <div className="p-6 space-y-6">
//       <h1 className="text-2xl font-bold">🧠 Threat Intelligence & Heuristics</h1>
//       <HeuristicIncidentList />
//     </div>
//   );
// }
import styled, { createGlobalStyle } from "styled-components";
import HeuristicIncidentList from "../components/HeuristicIncidentList";

export default function ThreatIntelPage() {
  return (
    <>
      <GlobalStyle />
      <PageContainer>
        {/* <PageTitle>🧠 Threat Intelligence & Heuristics</PageTitle> */}
        <HeuristicIncidentList />
      </PageContainer>
    </>
  );
}

// 🔧 Глобальный стиль: убираем белый фон у body и html
const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    background-color: #1f1f1f;
    color: #e4e4e4;
    font-family: 'Inter', sans-serif;
  }
`;

// 🧩 Стили контейнера страницы
const PageContainer = styled.div`
  padding: 40px 20px;
  min-height: 100vh;
`;

// 🧩 Стили заголовка
const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 30px;
`;
