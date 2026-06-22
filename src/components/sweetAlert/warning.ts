import React,{useEffect} from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { SweetAlertProps } from "../../types/type";

const MySwal = withReactContent(Swal);

const SweetAlertComponent:React.FC<SweetAlertProps>=({confirm,cancel,title,type})=>{
    useEffect(()=>{
       MySwal.fire({
        title,
        icon: type,
        showCancelButton:true,
       }).then((result)=>{
        result.isConfirmed ? confirm() : cancel();
       });
    });
    return null;
};

export default SweetAlertComponent;