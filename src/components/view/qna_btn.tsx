import { useReactiveVar } from "@apollo/client";
import React, { useEffect } from "react";
import { isNewQnaInVar, isQnaModalOnInVar } from "../../apollo";
import { useGetStreamKey } from "../../hooks/useKey";
import { useGetChatQnaList } from "../../hooks/useQna";

export const QnaBtn = () => {
  const { data } = useGetStreamKey();
  const isNewQna = useReactiveVar(isNewQnaInVar);
  const openQna = (e: any) => {
    e.stopPropagation();
    isQnaModalOnInVar(true);
  };
  return (
    <button onClick={openQna} className={"btn"} style={{ bottom: "70px" }}>
      <span className={"btn_inner"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="100%"
          height="100%"
          viewBox="0 0 80 80"
        >
          <defs></defs>
          <g id="qna">
            <g id="그룹_4" data-name="그룹 4">
              <circle
                id="타원_2"
                data-name="타원 2"
                className="cls-1"
                cx="40"
                cy="40"
                r="40"
              />
              <image
                id="벡터_고급_개체"
                data-name="벡터 고급 개체"
                x="21"
                y="21"
                width="39"
                height="39"
                xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAADqklEQVRYhcWYT2hdRRTGf/NSlSDFthZj3Piv0ZL6h2JxU6mCpHZnoi6STe1GEDcJFHfu3CmIVDcuAi66EBRcKCgJCCIiGqTVmoclSMCNhVRaFDTEpD8XM89Mbt9r3p2XxG8z983M+c5375uZc84ECqAOAiPAk8Ah4H5gL9AHrAFXgF+AeeBLYDaE8FuJr24FBXVUnVHXrIe1ZDeqhm59djVRHQHeBoYrQz8A3wEXgd+Bq8Ae4HbgQeBx4NGKTROYCiHMdiuyk6jd6tnKV2iqk+pAlxwDaX6zwnNW3V0qbEhdyMgW1TG1UcjXSPaLGeeCOlSX6LC6lJG8o/aXiGrD3Z/4WlhSD3drPJQJW1EntkJUGz8Tib8l8MZfMK2xhUzYie0Qlvk7kQlcuOEarCz+bflibXxO5Juk06SRfI3thLDMd74GR6qDQZ3PduWWLP4a4vqzXTxvflAbT+4Wxgod3KE+oN5WaD+WaRjNB2ZSZ9Oa51ha1D9lxNfUr9UnavI0XD+oZ1qdg67HysmahM/YOc6uqE/V5JtMtmvqIOrJjLCrkJSRncts59S3srWr+lVNvoHM9iTqdPpxvg5RIvsrWw43p779mYPlAs7zyXa6QczHIGYXdTEOvA+8GEJYSX33ZuN/F3C2dBzC9VB1uoBoA4w77nL25d4r4DidbJdQV9OPUz0Ke7eyIb6xICVSTyX7VTKy0c1NOxIerAh7U72lkOu5FskuYs7fR8xgS3Fn9vxJCOHVHrj2pna5QSxGIKbWpbiUPTd74IF1cVd2Eauk/cScvwghhJ+NB+7dwEc9imvVKb82iOUbxGKkF6wC/wDXeuQ5ktrve4oQLajPZxyflqpS7zLGZtVTDWCW9bcdL+Q9mj3XCvgVvEAsV1eB+JL2kJUk+8fUq4nj9RJVbsxKPs8HtiKfu9V4TVEEdbztmev/nAknDXPJ/zlTJtwACCEITKV59wBv7LQ44M/UNpOejXBj9VW6OYqgnkl+26duXl+3Ht9BcS8nv8tqX6dJ1Yp/R76geiz71zpX/15/V3JmuzeJuq/tbu0weTtumcbVi+ol9Yv00i+pR9U9qV/1tW4It+J+blCdUi+4OVqh6wPo7WZT4Ec23mz+QUx59gEHicnEMOnISmgCH6bx4dTeVHF5IYTwSNf3s8aD8VngFeDpisPNsEqM4dPAxyGE/zIXY8J7gFhoPZzaA8CRrsVVhA4Cx4FjwEPAfazfpgNcBhaBOeBb4LMQwlJdP/8Cg8sj8yD0G60AAAAASUVORK5CYII="
              />
            </g>
          </g>
        </svg>

        <span className={"blind"}>질문답변</span>
        <i className={isNewQna ? "qna_new_btn" : ""}></i>
        <span className={"blind"}>새로운 질문답변</span>
      </span>
    </button>
  );
};
