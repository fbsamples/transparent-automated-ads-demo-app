/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {createContext, useContext} from "react";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}
