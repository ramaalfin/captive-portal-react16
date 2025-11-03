import React from "react";
import { Route, Switch } from "react-router-dom";
import RootLayout from "../components/Layouts/RootLayout";
import CaptivePage from "../pages/captive";
import ActivePage from "../pages/active";
import NotFound from "../features/NotFound";

function AppRoutes() {
  return (
    <RootLayout>
      <Switch>
        <Route exact path="/" component={CaptivePage} />
        <Route path="/active" component={ActivePage} />
        <Route component={NotFound} />
      </Switch>
    </RootLayout>
  );
}

export default AppRoutes;
