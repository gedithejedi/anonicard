import React from 'react'
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
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { goerli } from 'wagmi/chains'
import { NFTStorage, File } from 'nft.storage'

import OriginalAnoni from '~/abi/OriginalAnoni.json'
import nftConfig from '~/nftConfig.json'
import Lit from '~/Lit'

import Button from '~/components/Common/Button'

const STORAGE_API_KEY = process.env.NEXT_PUBLIC_STORAGE_API_KEY

// NFT INFORMATION
const nftName = 'originalAnoni'
const nftDescription =
  'This is Original Anoni card. This will be original of Anonicard that will be minted in the future.'

interface IFormValues {
  // TODO: Image should have size limit (else converting blob to string will fail)
  'Profile Image': File[]
  'Full Name': string
  'Discord Name': string
  Job: number
  Introduction: string
}

type InputProps = {
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
    {error && <span className="SubText">This field is required</span>}
  </>
)

const OriginalForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const [uri, setUri] = useState<string | undefined>()
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

  const onSubmit: SubmitHandler<IFormValues> = async (data) => {
    setIsMinting(true)
    try {
      await storeAsset(data)
    } catch (e) {
      console.error(`Minting failed! ${e}`)
      setIsMinting(false)
    }
  }

  const { refetch } = useContractRead({
    address: nftConfig.originalAnoni.address as `0x${string}`,
    abi: OriginalAnoni,
    functionName: 'totalSupply',
  })

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: nftConfig.originalAnoni.address as `0x${string}`,
    abi: OriginalAnoni,
    functionName: 'mint',
    args: [uri],
    chainId: goerli.id,
    enabled: Boolean(uri),
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
        fullName: formData['Full Name'],
        discordName: formData['Discord Name'],
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

  useEffect(() => {
    if (uri && write) {
      if (!isPrepareError) {
        try {
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
    reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  useEffect(() => {
    loadDefaultImage()
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-2">
        <label className="flex flex-col">
          Profile Image
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            {...register('Profile Image', { required: true })}
          />
        </label>
        <Input
          label="Full Name"
          register={register}
          error={errors['Full Name']}
          required
        />
        <Input
          label="Discord Name"
          register={register}
          error={errors['Discord Name']}
          required
        />
        <Input label="Job" register={register} error={errors['Job']} required />
        <label className="flex flex-col Label">
          Introduction
          <textarea
            cols={4}
            {...register('Introduction', { required: true })}
          />
        </label>
        <Button type="submit">submit</Button>
      </div>
    </form>
  )
}

export default OriginalForm
