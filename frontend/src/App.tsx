// import { Refine } from "@refinedev/core";
// import routerProvider from "@refinedev/react-router-v6";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { dataProvider } from "./dataProvider";
// import AlertsList from "./pages/AlertsList";
// import HttpList from "./pages/HttpList";

// function App() {
//   return (
//     <BrowserRouter>
//       <Refine
//         routerProvider={routerProvider}
//         dataProvider={dataProvider}
//         resources={[
//           { name: "alerts", list: "/alerts" },
//           { name: "http",   list: "/http"    },
//         ]}
//       >
//         <Routes>
//           <Route path="/" element={<AlertsList />} />
//           <Route path="/http" element={<HttpList />} />
//         </Routes>
//       </Refine>
//     </BrowserRouter> 
//   );
// }
//export default App;


import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { dataProvider } from "./dataProvider";
import AlertsList from "./pages/AlertsList";
import DnsList from "./pages/DnsList";
import HttpList from "./pages/HttpList";

function App() {
  return (
    <BrowserRouter>
      <Refine
        routerProvider={routerProvider}
        dataProvider={dataProvider}
        options={{ disableTelemetry: true }}
        resources={[
          { name: "alerts", list: "/alerts" },
          { name: "http", list: "/http" },
          { name: "dns", list: "/dns" },
        ]}
      >
        <Routes>
          
          <Route path="/dns" element={<DnsList />} />
          <Route path="/alerts" element={<AlertsList />} />
          <Route path="/http" element={<HttpList />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;






// function App() {
//   return (
//     <BrowserRouter>
//       <GitHubBanner />
//       <RefineKbarProvider>
//         <ColorModeContextProvider>
//           <CssBaseline />
//           <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
//           <RefineSnackbarProvider>
//             <DevtoolsProvider>
//               <Refine
//                 notificationProvider={useNotificationProvider}
//                 routerProvider={routerBindings}
//                 dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
//                 options={{
//                   syncWithLocation: true,
//                   warnWhenUnsavedChanges: true,
//                   useNewQueryKeys: true,
//                   projectId: "p0EZQd-aHa7xF-zuhF4m",
//                 }}
//               >
//                 <Routes>
//                   <Route index element={<WelcomePage />} />
//                 </Routes>
//                 <RefineKbar />
//                 <UnsavedChangesNotifier />
//                 <DocumentTitleHandler />
//               </Refine>
//               <DevtoolsPanel />
//             </DevtoolsProvider>
//           </RefineSnackbarProvider>
//         </ColorModeContextProvider>
//       </RefineKbarProvider>
//     </BrowserRouter>
//   );
// }


