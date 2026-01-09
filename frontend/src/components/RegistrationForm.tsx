import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { First10Badge } from './First10Badge'

const GRADES = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

interface FormData {
  parent_names: string
  email: string
  grade_level: string
  num_adults: number
  needs_babysitting: boolean | null
  babysitting_notes: string
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    parent_names: '',
    email: '',
    grade_level: '',
    num_adults: 1,
    needs_babysitting: null,
    babysitting_notes: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isFirst10, setIsFirst10] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    setFormData((prev) => {
      if (type === 'radio' && name === 'needs_babysitting') {
        return {
          ...prev,
          needs_babysitting: value === 'true',
          babysitting_notes: value === 'false' ? '' : prev.babysitting_notes, // Clear babysitting_notes if "No" is selected
        }
      }
      return {
        ...prev,
        [name]: name === 'num_adults' ? parseInt(value) : value,
      }
    })
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.parent_names.trim()) {
      newErrors.parent_names = 'Parent name(s) is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.grade_level) {
      newErrors.grade_level = 'Please select a grade level'
    }

    if (formData.needs_babysitting === null) {
      newErrors.needs_babysitting = 'Please indicate if you need babysitting'
    }

    if (formData.needs_babysitting === true && !formData.babysitting_notes.trim()) {
      newErrors.babysitting_notes = 'Please provide kids\' names and ages'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitSuccess(false)

    try {
      // Check current count for selected grade
      const { data: existingRegistrations, error: countError } = await supabase
        .from('registrations')
        .select('id')
        .eq('grade_level', formData.grade_level)

      if (countError) throw countError

      const currentCount = existingRegistrations?.length || 0
      const willBeFirst10 = currentCount < 10
      const registrationNumber = currentCount + 1

      // Insert registration
      const { data, error } = await supabase
        .from('registrations')
        .insert({
          parent_names: formData.parent_names.trim(),
          email: formData.email.trim().toLowerCase(),
          grade_level: formData.grade_level,
          num_adults: formData.num_adults,
          needs_babysitting: formData.needs_babysitting,
          babysitting_notes: formData.needs_babysitting ? formData.babysitting_notes.trim() : null,
          is_first_10: willBeFirst10,
          registration_number: registrationNumber,
          confirmation_sent: false,
        })
        .select()
        .single()

      if (error) throw error

      setIsFirst10(willBeFirst10)
      setSubmitSuccess(true)

      // Trigger email confirmation via Edge Function
      try {
        const { error: emailError } = await supabase.functions.invoke('send-confirmation', {
          body: { registration_id: data.id },
        })
        if (emailError) {
          console.error('Email sending error:', emailError)
          // Don't fail the registration if email fails
        }
      } catch (emailErr) {
        console.error('Email function error:', emailErr)
      }

      // Reset form
      setFormData({
        parent_names: '',
        email: '',
        grade_level: '',
        num_adults: 1,
        needs_babysitting: null,
        babysitting_notes: '',
      })
    } catch (error) {
      console.error('Registration error:', error)
      alert('There was an error submitting your registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="text-center">
        <h2 className="font-playfair text-3xl font-bold text-gold mb-4">Registration Successful!</h2>
        {isFirst10 && (
          <div className="mb-4">
            <First10Badge />
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="font-playfair text-2xl md:text-3xl font-bold text-gold mb-6 text-center">Event Registration</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="parent_names" className="block text-gold font-semibold mb-2 text-sm tracking-wider uppercase">
            Parent Name(s) *
          </label>
          <input
            type="text"
            id="parent_names"
            name="parent_names"
            value={formData.parent_names}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-dark-brown-2 border-2 border-gold rounded text-cream placeholder-cream placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-baskerville ${errors.parent_names ? 'border-red-500' : ''}`}
            placeholder="Enter parent name(s)"
          />
          {errors.parent_names && (
            <p className="text-red-400 text-sm mt-1">{errors.parent_names}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-gold font-semibold mb-2 text-sm tracking-wider uppercase">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-dark-brown-2 border-2 border-gold rounded text-cream placeholder-cream placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-baskerville ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="grade_level" className="block text-gold font-semibold mb-2 text-sm tracking-wider uppercase">
            Grade Level *
          </label>
          <select
            id="grade_level"
            name="grade_level"
            value={formData.grade_level}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-dark-brown-2 border-2 border-gold rounded text-cream focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-baskerville ${errors.grade_level ? 'border-red-500' : ''}`}
          >
            <option value="" className="bg-dark-brown-2 text-cream">Select a grade</option>
            {GRADES.map((grade) => (
              <option key={grade} value={grade} className="bg-dark-brown-2 text-cream">
                {grade === 'K' ? 'Kindergarten' : `${grade} Grade`}
              </option>
            ))}
          </select>
          {errors.grade_level && (
            <p className="text-red-400 text-sm mt-1">{errors.grade_level}</p>
          )}
        </div>

        <div>
          <label className="block text-gold font-semibold mb-2 text-sm tracking-wider uppercase">
            Number of Adults Attending *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="num_adults"
                value="1"
                checked={formData.num_adults === 1}
                onChange={handleChange}
                className="mr-2 w-5 h-5 text-gold focus:ring-gold accent-gold"
              />
              <span className="text-cream">1 Adult</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="num_adults"
                value="2"
                checked={formData.num_adults === 2}
                onChange={handleChange}
                className="mr-2 w-5 h-5 text-gold focus:ring-gold accent-gold"
              />
              <span className="text-cream">2 Adults</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-gold font-semibold mb-2 text-sm tracking-wider uppercase">
            Need Babysitting? *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="needs_babysitting"
                value="true"
                checked={formData.needs_babysitting === true}
                onChange={handleChange}
                className="mr-2 w-5 h-5 text-gold focus:ring-gold accent-gold"
              />
              <span className="text-cream">Yes</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="needs_babysitting"
                value="false"
                checked={formData.needs_babysitting === false}
                onChange={handleChange}
                className="mr-2 w-5 h-5 text-gold focus:ring-gold accent-gold"
              />
              <span className="text-cream">No</span>
            </label>
          </div>
          {errors.needs_babysitting && (
            <p className="text-red-400 text-sm mt-1">{errors.needs_babysitting}</p>
          )}
        </div>

        {formData.needs_babysitting === true && (
          <div>
            <label htmlFor="babysitting_notes" className="block text-gold font-semibold mb-2 text-sm tracking-wider uppercase">
              Kids' Names and Ages *
            </label>
            <textarea
              id="babysitting_notes"
              name="babysitting_notes"
              value={formData.babysitting_notes}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 bg-dark-brown-2 border-2 border-gold rounded text-cream placeholder-cream placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-baskerville resize-y ${errors.babysitting_notes ? 'border-red-500' : ''}`}
              placeholder="Please list each child's name and age (e.g., Sarah, age 7; Jacob, age 5)"
            />
            {errors.babysitting_notes && (
              <p className="text-red-400 text-sm mt-1">{errors.babysitting_notes}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex flex-row flex-wrap justify-center items-center bg-gold text-dark-brown-2 px-4 py-4.5 text-base tracking-widest uppercase font-bold border-none cursor-pointer mt-6 transition-all duration-300 shadow-[0_6px_20px_rgba(212,175,55,0.4)] font-baskerville hover:bg-light-gold hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-gold"
          style={{ height: '56px' }}
        >
          {isSubmitting ? 'Submitting...' : 'submit'}
        </button>
      </div>
    </form>
  )
}

