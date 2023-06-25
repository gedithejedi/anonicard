import React, { useState } from 'react'
import {
  Path,
  useForm,
  UseFormRegister,
  SubmitHandler,
  FieldError,
} from 'react-hook-form'

import {
  useContractRead,
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { polygon } from 'wagmi/chains'
import { NFTStorage, File } from 'nft.storage'

import Anonicard from '~/abi/Anonicard.json'
import nftConfig from '~/nftConfig.json'
import Lit from '~/Lit'

import { useToast } from '@chakra-ui/react'
import IOriginalNft from '~/types'
import Button from '~/components/Common/Button'
import QrScanner from '~/components/Common/QrScanner'

const STORAGE_API_KEY = process.env.NEXT_PUBLIC_STORAGE_API_KEY

// NFT INFORMATION
const nftName = 'anonicard'
const nftDescription = 'This is Anoni card.'

// FORM TYPES
export interface IFormValues {
  // TODO: Image should have size limit (else converting blob to string will fail)
  'Wallet Address': string
  'Profile Image': File[]
  'Full Name': string
  'Discord Handle': string
  Job: number
  Introduction: string
  Occassion: string
  Memo: string
}

type InputProps = {
  disabled?: boolean
  label: Path<IFormValues>
  register: UseFormRegister<IFormValues>
  required?: boolean
  error?: FieldError
}

// COMPONENT PROP TYPE
interface Props {
  defaultNft: IOriginalNft
  onSuccess: () => void
}

const Input = ({
  label,
  register,
  required = false,
  error,
  disabled = false,
}: InputProps) => (
  <>
    <label className="flex flex-col">
      {label}
      <input {...register(label, { required, disabled })} />
    </label>
    {error && (
      <span className="SubText text-red-500">This field is required</span>
    )}
  </>
)

const AnoniForm: React.FC<Props> = ({ defaultNft, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: defaultNft,
  })

  const [toAddress, setToAddress] = useState()
  const [uris, setUris] = useState<string[] | undefined>()
  const [defaultImage, setDefaultImage] = useState<File>()
  const [isMinting, setIsMinting] = useState<boolean>(false)

  // TODO: replace it with Nouns image
  const loadDefaultImage = async () => {
    const res = await fetch('/CAT.jpg')
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    setDefaultImage(
      new File([await res.blob()], 'defaultImage.jpg', { type: 'image/jpeg' })
    )
  }

  const onSubmit: SubmitHandler<IFormValues> = (data) => {
    setIsMinting(true)
    try {
      const data = {
        ...data,
        ...defaultNft,
      }
      await storeAsset(data)
    } catch (e) {
      console.error(`Minting failed! ${e}`)
      toast({
        title: 'Anonicard minting failed.',
        description: `Your Anonicard could not be minted! ${e}`,
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      setIsMinting(false)
    }
  }

  const { refetch } = useContractRead({
    address: nftConfig.anonicard.address as `0x${string}`,
    abi: Anonicard.abi,
    functionName: 'totalSupply',
  })

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: nftConfig.anonicard.address as `0x${string}`,
    abi: Anonicard.abi,
    functionName: 'mint',
    args: [uris[0], uris[1]],
    chainId: polygon.id,
    enabled: Boolean(uris),
  })

  const { data, error, isError, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  async function storeAsset(formData: IFormValues) {
    if (!STORAGE_API_KEY) {
      console.error('Required API Key has not been provided.')
      throw Error('This method cannot be executed.')
    }

    const client = new NFTStorage({
      token: STORAGE_API_KEY,
    })

    const { data: nftTotalSupply } = await refetch()
    const encryptedInformation = await Lit.encryptObject(
      nftName,
      {
        walletAddress: formData['Wallet Address']
        fullName: formData['Full Name'],
        discordName: formData['Discord Handle'],
        job: formData['Job'],
        introduction: formData['Introduction'],
      },
      String(Number(nftTotalSupply) + 1)
    )

    const { encryptedFile, encryptedSymmetricKey: encryptedFileSymmetricKey } =
      await Lit.encryptFile(
        nftName,
        formData['Profile Image']?.[0],
        String(Number(nftTotalSupply) + 1)
      )

    // TODO: Encrypt image once we get getting NFT part done.
    const metadata = await client.store({
      name: nftName,
      description: nftDescription,
      encryptedString: encryptedInformation?.encryptedString,
      encryptedStringSymmetricKey: encryptedInformation?.encryptedSymmetricKey,
      image: defaultImage as File,
      encryptedImage: encryptedFile,
      encryptedFileSymmetricKey,
    })

    setUri(metadata.url)
    console.log('Metadata stored on Filecoin and IPFS with URL:', metadata.url)
  }

  const onReadQrCode = (data) => {
    setToAddress(data)
  }
  return toAddress ? (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-2">
        <p className="pb-2 text-sm">send to: {toAddress}</p>
        <p className="pb-2 text-sm">
          send from: {defaultNft['Wallet Address']}
        </p>

        <label className="flex flex-col">
          Profile Image
          <input
            type="file"
            className="bg-white"
            accept="image/png, image/jpeg, image/jpg"
            disabled={true}
            {...register('Profile Image')}
          />
        </label>
        <Input label="Full Name" register={register} disabled={true} />
        <Input label="Discord Handle" register={register} disabled={true} />
        <Input label="Job" register={register} disabled={true} />
        <label className="flex flex-col Label">
          Introduction
          <textarea {...register('Introduction')} disabled={true} />
        </label>
        <Input label="Occassion" register={register} />
        <Input label="Memo" register={register} />
        <div className="mt-4 flex flex-col">
          <Button type="submit">submit</Button>
        </div>
      </div>
    </form>
  ) : (
    <QrScanner onReadQrCode={onReadQrCode} />
  )
}

export default AnoniForm
