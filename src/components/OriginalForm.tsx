import React from 'react'
import {
  Path,
  useForm,
  UseFormRegister,
  SubmitHandler,
  FieldError,
} from 'react-hook-form'
import Button from '~/components/Common/Button'

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
    <label>{label}</label>
    <input {...register(label, { required })} />
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

  const onSubmit: SubmitHandler<IFormValues> = (data) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-2">
        <label className="font-bold">Profile Image</label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          {...register('Profile Image', { required: true })}
        />
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
        <label className="font-bold">Introduction</label>
        <textarea cols={4} {...register('Introduction', { required: true })} />
        <Button type="submit">submit</Button>
      </div>
    </form>
  )
}

export default OriginalForm
