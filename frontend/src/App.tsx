// import { Refine } from "@refinedev/core";
// import routerProvider from "@refinedev/react-router-v6";
// import { BrowserRouter, Route, Routes } from "react-router-dom";

// import { dataProvider } from "./dataProvider";
// import AlertsList from "./pages/AlertsList";
// import DnsList from "./pages/DnsList";
// import HttpList from "./pages/HttpList";
// // added web-socket
// import React, { useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// function App() {
//   return (
//     <BrowserRouter>
//       <Refine
//         routerProvider={routerProvider}
//         dataProvider={dataProvider}
//         options={{ disableTelemetry: true }}
//         resources={[
//           { name: "alerts", list: "/alerts" },
//           { name: "http", list: "/http" },
//           { name: "dns", list: "/dns" },
//         ]}
//       >
//         <Routes>
          
//           <Route path="/dns" element={<DnsList />} />
//           <Route path="/alerts" element={<AlertsList />} />
//           <Route path="/http" element={<HttpList />} />
//         </Routes>
//       </Refine>
//     </BrowserRouter>
//   );
// }

// export default App;

// src/App.tsx
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import { dataProvider } from "./dataProvider";
import AlertsList from "./pages/AlertsList";
import DnsList from "./pages/DnsList";
import HttpList from "./pages/HttpList";

const SOCKET_URL = "http://localhost:4000"; // или твой бэкенд

/**
 * Хук для подписки на WebSocket-события и инвалидации кэша
 */
// const RealTimeUpdater: React.FC = () => {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const socket: Socket = io(SOCKET_URL);

//     socket.on("connect", () => {
//       console.log("✅ WebSocket connected:", socket.id);
//     });

//     // При новом алерте — обновляем список AlertsList

//     socket.on("new-alert", () => {
//       queryClient.invalidateQueries(["alerts"]);
//     });

//     // При новом HTTP-логе — обновляем HttpList
//     socket.on("new-http", () => {
//       queryClient.invalidateQueries(["http"]);
//     });

//     // При новом DNS-логе — обновляем DnsList
//     socket.on("new-dns", () => {
//       queryClient.invalidateQueries(["dns"]);
//     });

//     socket.on("disconnect", () => {
//       console.warn("🛑 WebSocket disconnected");
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [queryClient]);

//   return null;
// };
// const RealTimeUpdater: React.FC = () => {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     const socket: Socket = io(SOCKET_URL);

//     socket.on("connect", () => {
//       console.log("✅ WebSocket connected:", socket.id);
//     });

//     socket.on("new-alert", data => {
//       console.log("🛰️ Received new-alert:", data);
//       queryClient.invalidateQueries({
//         queryKey: ["alerts"],
//         refetchType: "active"
//       });
//     });

//     socket.on("new-http", data => {
//       console.log("🛰️ Received new-http:", data);
//       queryClient.invalidateQueries({
//         queryKey: ["http"],
//         refetchType: "active"
//       });
//     });

//     socket.on("new-dns", data => {
//       console.log("🛰️ Received new-dns:", data);
//       queryClient.invalidateQueries({
//         queryKey: ["dns"],
//         refetchType: "active"
//       });
//     });

//     socket.on("disconnect", () => {
//       console.warn("🛑 WebSocket disconnected");
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [queryClient]);

//   return null;
// };
const RealTimeUpdater: React.FC = () => {
  const queryClient = useQueryClient();

  // Хелпер для создания predicate по ресурсу
  const makePredicate = (resource: string) => (query: any) =>
    Array.isArray(query.queryKey) &&
    query.queryKey[0] === "resources" &&
    query.queryKey[1] === resource &&
    query.queryKey[2] === "list";

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("✅ WebSocket connected:", socket.id);
    });

    socket.on("new-alert", data => {
      console.log("🛰️ Received new-alert:", data);
      queryClient.invalidateQueries({
        predicate: makePredicate("alerts"),
        refetchType: "active",
      });
    });

    socket.on("new-http", data => {
      console.log("🛰️ Received new-http:", data);
      queryClient.invalidateQueries({
        predicate: makePredicate("http"),
        refetchType: "active",
      });
    });

    socket.on("new-dns", data => {
      console.log("🛰️ Received new-dns:", data);
      queryClient.invalidateQueries({
        predicate: makePredicate("dns"),
        refetchType: "active",
      });
    });

    socket.on("disconnect", () => {
      console.warn("🛑 WebSocket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return null;
};

function App() {
  //const queryClient = new QueryClient();

  return (
    //<QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Хук подписки должен быть внутри провайдера React Query */}
        <RealTimeUpdater />

        <Refine
          routerProvider={routerProvider}
          dataProvider={dataProvider}
          options={{ disableTelemetry: true }}
          resources={[
            { name: "alerts", list: "/alerts" },
            { name: "http",   list: "/http"   },
            { name: "dns",    list: "/dns"    },
          ]}
        >
          <Routes>
            <Route path="/alerts" element={<AlertsList />} />
            <Route path="/http"    element={<HttpList />} />
            <Route path="/dns"     element={<DnsList />} />
          </Routes>
        </Refine>
      </BrowserRouter>
    //</QueryClientProvider>
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


