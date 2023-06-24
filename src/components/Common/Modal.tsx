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
import { Roboto_Mono } from 'next/font/google'

const robotoMono = Roboto_Mono({
  weight: ['200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

interface Props {
  children?: React.ReactNode
  title?: string
  isOpen: boolean
  onClose: () => void
}

const BaseModal: React.FC<Props> = ({ children, title, isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          borderRadius="0"
          border="2px"
          borderColor="black"
          className={[robotoMono.className, 'w-full'].join(' ')}
        >
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="py-2">{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default BaseModal
