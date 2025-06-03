import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function ConfirmationModalwithButtons({
  isOpen = false,
  onOpenChange = () => {},
  title = "Confirmation",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm = () => {},
  onCancel = () => {},
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="backdrop-blur-md bg-black/50">
      <ModalContent className="bg-white drop-shadow-2xl rounded-xl p-6 border border-gray-200">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-white text-center">
              <h2 className="text-2xl font-bold text-black">{title}</h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-700 text-2xl font-medium">{message}</p>
            </ModalBody>
            <ModalFooter className="flex justify-end gap-4 mt-4">
              <Button
                variant="outline"
                className="border-black text-black font-semibold px-6 py-2 rounded-full hover:bg-[#e07d6a] hover:text-white"
                onPress={() => {
                  onCancel();
                  onClose();
                }}>
                {cancelText}
              </Button>
              <Button
                className="bg-[#e07d6a] hover:bg-[#c9634f] text-white font-semibold px-6 py-2 rounded-full "
                onPress={() => {
                  onConfirm();
                  onClose();
                }}>
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
