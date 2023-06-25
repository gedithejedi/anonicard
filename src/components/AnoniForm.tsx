import React from 'react'
import {
  Path,
  useForm,
  UseFormRegister,
  SubmitHandler,
  FieldError,
} from 'react-hook-form'
import IOriginalNft from '~/types'
import Button from '~/components/Common/Button'
import QrReader from 'react-qr-scanner'

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

  const onSubmit: SubmitHandler<IFormValues> = (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-2">
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
  )
}

export default AnoniForm
