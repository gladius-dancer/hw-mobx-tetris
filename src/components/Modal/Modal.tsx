import * as React from "react";
import Modal from "react-modal";
import "./Modal.scss";

type ModalProps = {
    children: React.ReactElement;
    isOpen: boolean;
    className: string;
    overlayClassName: string;
};

export default function ModalComponent({children, isOpen, className}: ModalProps) {

    return (
        <Modal
            isOpen={isOpen}
            className="modal-content"
            overlayClassName="modal-back"
        >
            {children}
        </Modal>
    );
}
