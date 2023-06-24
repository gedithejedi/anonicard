import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

interface Props {
  children?: React.ReactNode
  title?: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const BaseModal: React.FC<Props> = ({
  children,
  title,
  isOpen,
  onOpen,
  onClose,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="0" border="2px" borderColor="black">
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="py-2">{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default BaseModal
