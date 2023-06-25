import React, { useMemo } from 'react'
import { useState, useEffect } from 'react'
import {
  Path,
  useForm,
  UseFormRegister,
  SubmitHandler,
  FieldError,
} from 'react-hook-form'

import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { polygon } from 'wagmi/chains'
import { NFTStorage, File } from 'nft.storage'

import OriginalAnoni from '~/abi/OriginalAnoni.json'
import nftConfig from '~/nftConfig.json'
import Lit from '~/Lit'

import { useToast } from '@chakra-ui/react'
import Button from '~/components/Common/Button'
import Loader from '~/components/Common/Loader'
import { OriginalNFT } from '~/components/Anoni/Original'
import * as LitJsSdk from '@lit-protocol/lit-node-client'

const STORAGE_API_KEY = process.env.NEXT_PUBLIC_STORAGE_API_KEY

// NFT INFORMATION
const nftName = 'originalAnoni'
const nftDescription =
  'This is Original Anoni card. This will be original of Anonicard that will be minted in the future.'

// FORM TYPES
interface IFormValues {
  // TODO: Image should have size limit (else converting blob to string will fail)
  'Profile Image': File[] | undefined
  'Full Name': string
  'Discord Handle': string
  Job: string
  Introduction: string
}

type InputProps = {
  disabled?: boolean
  label: Path<IFormValues>
  register: UseFormRegister<IFormValues>
  required?: boolean
  error?: FieldError
}

const Input = ({ label, register, required = false, error }: InputProps) => (
  <>
    <label className="flex flex-col">
      {label}
      <input {...register(label, { required })} />
    </label>
    {error && (
      <span className="SubText text-red-500">This field is required</span>
    )}
  </>
)

// COMPONENT PROP TYPE
interface Props {
  onSuccess: () => void
  oldData: OriginalNFT
}

const OriginalFormEdit: React.FC<Props> = ({ onSuccess, oldData }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      'Full Name': oldData?.fullName || '',
      'Discord Handle': oldData?.discordName || '',
      Job: oldData?.job || '',
      Introduction: oldData?.introduction || '',
      'Profile Image': undefined,
    },
  })
  const toast = useToast()

  const [uri, setUri] = useState<string | undefined>()
  const [defaultImage, setDefaultImage] = useState<File>()
  const [blobImage, setBlobImage] = useState('')
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [discordName, setDiscordName] = useState('')

  const getNounsImage = async () => {
    const res = await fetch('https://api.cloudnouns.com/v1/pfp')
    if (!res.ok) {
      console.log(res.text())
      throw new Error('Failed to fetch data')
    }

    const blob = await res.blob()
    const file = new File([blob], 'nounVatar.jpg', { type: 'image/svg' })
    setValue('Profile Image', [file])
    setDefaultImage(file)
    const url = window.URL.createObjectURL(blob)
    setBlobImage(url)
  }

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    setIsMinting(true)
    try {
      const dataWithDiscordId = {
        ...data,
        'Discord Handle': discordName || '',
      }

      await storeAsset(dataWithDiscordId, oldData?.tokenId)
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
    address: nftConfig.originalAnoni.address as `0x${string}`,
    abi: OriginalAnoni.abi,
    functionName: 'totalSupply',
  })

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: nftConfig.originalAnoni.address as `0x${string}`,
    abi: OriginalAnoni.abi,
    functionName: 'updateMetadata',
    args: [oldData?.tokenId, uri],
    chainId: polygon.id,
    enabled: Boolean(uri),
  })

  const { data, error, isError, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  async function storeAsset(formData: IFormValues, defaultTokenId?: string) {
    if (!STORAGE_API_KEY) {
      console.error('Required API Key has not been provided.')
      throw Error('This method cannot be executed.')
    }

    const client = new NFTStorage({
      token: STORAGE_API_KEY,
    })

    const { data: nftTotalSupply } = await refetch()
    const tokenId = defaultTokenId ?? String(Number(nftTotalSupply) + 1)

    const encryptedInformation = await Lit.encryptObject(
      nftName,
      {
        fullName: formData['Full Name'],
        discordName: formData['Discord Handle'],
        job: formData['Job'],
        introduction: formData['Introduction'],
      },
      tokenId
    )

    const { encryptedFile, encryptedSymmetricKey: encryptedFileSymmetricKey } =
      await Lit.encryptFile(nftName, formData['Profile Image']?.[0], tokenId)

    const metadata = await client.store({
      name: nftName,
      description: nftDescription,
      encryptedString: encryptedInformation?.encryptedString,
      encryptedStringSymmetricKey: encryptedInformation?.encryptedSymmetricKey,
      image: defaultImage as File,
      encryptedImage: encryptedFile,
      encryptedFileSymmetricKey,
    })
    console.log(metadata)
    setUri(metadata.url)
    console.log('Metadata stored on Filecoin and IPFS with URL:', metadata.url)
  }

  useEffect(() => {
    if (uri && write) {
      if (!isPrepareError) {
        try {
          console.log(uri)
          write()
        } catch {
          console.error(`minting failed with error. Error: ${error}`)
        } finally {
          setUri(undefined)
          setIsMinting(false)
        }
      } else {
        console.error(`NFT cannot be minted ${prepareError}`)
      }
    }
  }, [uri, write, data])

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Anonicard minted.',
        description: 'Your Anonicard has been successfully minted!',
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
      onSuccess()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    getNounsImage()
  }, [])

  const getDiscordHandleFromLocalStorage = () => {
    const localStorageName = localStorage.getItem('discordName')
    if (localStorageName == null) {
      return
    }
    setDiscordName(localStorageName)
  }

  React.useEffect(() => {
    window.addEventListener('storage', getDiscordHandleFromLocalStorage)

    return () => {
      window.removeEventListener('storage', getDiscordHandleFromLocalStorage)
    }
  }, [])

  return (
    <>
      {(isMinting || isLoading) && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-xl text-bold mb-8 text-center">
          Edit an AnoniCard
        </h1>
        <div className="flex flex-col gap-y-2">
          <label className="flex flex-col">
            ProfileImage
            <div className="flex flex-col">
              {defaultImage && <img src={blobImage} alt="noun image" />}
              <p className="w-full flex gap-2">
                1 file, {defaultImage?.name && defaultImage.name} uploaded
              </p>
              <div className="flex gap-4 my-4 w-full">
                <Button onClick={() => getNounsImage()} type={'button'}>
                  Get Nouns Picture
                </Button>
              </div>
            </div>
            {errors['Profile Image'] && (
              <span className="SubText text-red-500">
                This field is required
              </span>
            )}
          </label>
          <Input
            label="Full Name"
            register={register}
            error={errors['Full Name']}
            required
          />
          {discordName !== '' ? (
            <div className="relative">
              <label className="flex flex-col">
                Discord Handle
                <input
                  disabled={true}
                  value={discordName}
                  {...(register('Discord Handle'), { required: true })}
                />
                <a
                  target="_blank"
                  href={
                    process.env.NODE_ENV === 'development'
                      ? process.env.NEXT_PUBLIC_DISCORD_DEV
                      : process.env.NEXT_PUBLIC_DISCORD_PROD
                  }
                >
                  <svg
                    className="absolute right-2 bottom-2 my-auto w-6 h-6 cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </a>
              </label>
            </div>
          ) : (
            <>
              <label>{'Discord Handle'}</label>
              <a
                className="bg-discord text-white text-l max-w-[220px] py-2 rounded-md font-bold flex justify-center items-center space-x-4 hover:bg-gray-600 transition duration-75"
                target="_blank"
                href={
                  process.env.NODE_ENV === 'development'
                    ? process.env.NEXT_PUBLIC_DISCORD_DEV
                    : process.env.NEXT_PUBLIC_DISCORD_PROD
                }
              >
                Log in with Discord
              </a>
            </>
          )}
          {errors['Discord Handle'] && (
            <span className="SubText text-red-500">This field is required</span>
          )}
          <Input
            label="Job"
            register={register}
            error={errors['Job']}
            required
          />
          <label className="flex flex-col Label">
            Introduction
            <textarea cols={4} {...register('Introduction')} />
          </label>
          <Button type="submit">submit</Button>
        </div>
      </form>
    </>
  )
}
export default OriginalFormEdit
