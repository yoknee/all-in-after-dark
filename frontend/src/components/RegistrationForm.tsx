import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { GradeCounter } from './GradeCounter'
import { First10Badge } from './First10Badge'

const GRADES = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

interface FormData {
  parent_names: string
  email: string
  phone: string
  grade_level: string
  dietary_restrictions: string
  num_adults: number
}

export function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    parent_names: '',
    email: '',
    phone: '',
    grade_level: '',
    dietary_restrictions: '',
    num_adults: 1,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isFirst10, setIsFirst10] = useState(false)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\(\)]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'num_adults' ? parseInt(value) : value,
    }))
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

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (!formData.grade_level) {
      newErrors.grade_level = 'Please select a grade level'
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
          phone: formData.phone.trim(),
          grade_level: formData.grade_level,
          dietary_restrictions: formData.dietary_restrictions.trim() || null,
          num_adults: formData.num_adults,
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
        phone: '',
        grade_level: '',
        dietary_restrictions: '',
        num_adults: 1,
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
        <p className="text-cream text-lg mb-4">
          Thank you for registering. A confirmation email has been sent to {formData.email}.
        </p>
        {isFirst10 && (
          <div className="mb-4">
            <First10Badge />
          </div>
        )}
        <button
          onClick={() => setSubmitSuccess(false)}
          className="inline-block bg-gold text-dark-brown-2 px-12 py-4.5 text-base tracking-widest uppercase font-bold border-none cursor-pointer mt-4 transition-all duration-300 shadow-[0_6px_20px_rgba(212,175,55,0.4)] font-baskerville hover:bg-light-gold hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.6)]"
        >
          Register Another
        </button>
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
          <label htmlFor="phone" className="block text-gold font-semibold mb-2 text-sm tracking-wider uppercase">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-dark-brown-2 border-2 border-gold rounded text-cream placeholder-cream placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-baskerville ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
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
          {formData.grade_level && <GradeCounter selectedGrade={formData.grade_level} />}
        </div>

        <div>
          <label htmlFor="dietary_restrictions" className="block text-gold font-semibold mb-2 text-sm tracking-wider uppercase">
            Dietary Restrictions (Optional)
          </label>
          <textarea
            id="dietary_restrictions"
            name="dietary_restrictions"
            value={formData.dietary_restrictions}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-dark-brown-2 border-2 border-gold rounded text-cream placeholder-cream placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-baskerville"
            placeholder="Please list any dietary restrictions or allergies"
          />
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-block bg-gold text-dark-brown-2 px-12 py-4.5 text-base tracking-widest uppercase font-bold border-none cursor-pointer mt-6 transition-all duration-300 shadow-[0_6px_20px_rgba(212,175,55,0.4)] font-baskerville hover:bg-light-gold hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-gold"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Registration'}
        </button>
      </div>
    </form>
  )
}

