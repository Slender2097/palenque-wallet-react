import React, { useState } from "react";
import PaymentsModal from "./PaymentsModal";
import "./Buttons.css";

export const Buttons = () => {

    const [modalState, setModalState] = useState({
        type: "",
        open: false,
      });
     

 return (
   <div>
     <div className="buttons">
       <button
         className="button" 
         onClick={() =>
            setModalState({type: "send", open: true})

           /*console.log("This button will open a modal to send a payment")*/
         }
       >
         Send
       </button>
       <button
         className="button"
         onClick={() =>
            setModalState({type: "receive", open:true})
           
           /* console.log("This button will open a modal to receive a payment")*/
         }
       >
         Receive
       </button>
     </div>
     { <PaymentsModal modalState={modalState} setModalState={setModalState} /> }
   </div>
 );
};

export default Buttons;
