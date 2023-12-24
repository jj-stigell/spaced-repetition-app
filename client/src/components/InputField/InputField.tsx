import React, { ComponentProps } from 'react'
import { FormikErrors, FormikTouched } from 'formik'

interface IInputField<FormTypes> extends Omit<ComponentProps<'input'>, 'ref' | 'style'> {
  /**
   * The unique identifier for the input field. This ID will be used to connect the input field
   * with its label for accessibility purposes.
   */
  id: string
  /**
   * The text to be displayed as the label for the input field. This helps users understand
   * what information is required in the field.
   */
  label: string
  /**
   * Errors related to the input field. This could be a string, an array of strings, or
   * Formik-specific error types. This is used to display validation feedback to the user.
   * - A string for a single error message.
   * - An array of strings for multiple error messages.
   * - FormikErrors<FormTypes> for Formik form-level error handling.
   * - Array<FormikErrors<FormTypes>> for handling multiple Formik form-level errors.
   */
  errors?: string | string[] | FormikErrors<FormTypes> | Array<FormikErrors<FormTypes>>
  /**
   * Indicates whether the field has been touched. This is commonly used to determine when to display
   * error messages or validation feedback.
   * - A boolean value for simple true/false touch status.
   * - FormikTouched<FormTypes> for Formik form-level touch status.
   * - Array<FormikTouched<FormTypes>> for handling touch status for multiple fields.
   */
  fieldTouched?: boolean | FormikTouched<FormTypes> | Array<FormikTouched<FormTypes>>
}

export default function InputField<FormTypes> ({
  id,
  type,
  name,
  label,
  value,
  onChange,
  onBlur,
  errors,
  fieldTouched = false,
  placeholder,
  ...rest
}: IInputField<FormTypes>): React.JSX.Element {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
      <input
        className={`${
          Boolean(fieldTouched) && (errors != null)
            ? 'bg-red-300 border-red-500 text-red-700'
            : 'bg-gray-50 border-gray-300 text-gray-900'
        } border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...rest}
      />
      {Boolean(fieldTouched) && (errors != null)
        ? (<div className="text-xs font-medium text-red-700 mt-1">{errors as string}</div>)
        : null}
    </div>
  )
}
