import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

function ConfirmationModalCoupen({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="backdrop-blur-md bg-black/50">
      <ModalContent className="bg-white drop-shadow-2xl rounded-xl p-6 border-b-1 border-[#e07d6a]">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 bg-white text-center">
              <h2 className="text-2xl font-bold text-black">{title}</h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-700 text-lg font-medium">{message}</p>
            </ModalBody>
            <ModalFooter className="flex justify-end gap-4 mt-4">
              <Button
                color="danger"
                variant="light"
                className="text-red-600 font-semibold px-6 py-2 rounded-full hover:bg-red-50"
                onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                className="bg-[#e07d6a] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#a74d3b]"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ConfirmationModalCoupen;
