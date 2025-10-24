import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Router } from "./router";
import { Provider } from "@/components/provider";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Provider>
			<Router />
		</Provider>
	</StrictMode>,
);
