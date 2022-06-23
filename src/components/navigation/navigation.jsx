import React from "react";
import { useNavigate } from "react-router-dom";

export function naigateTo(newPath) {
     let navigate = useNavigate();

     navigate(newPath);

     return;
}
