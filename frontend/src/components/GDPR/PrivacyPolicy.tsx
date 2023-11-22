import { useState } from 'react'

interface PrivacyPolicyProps {
  onYes: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
  const [checked, setChecked] = useState(false)

  const handleCheckboxChange = () => {
    setChecked(!checked)
  }

  return (
    <div>
      <h1>Welcome to Petrichor!</h1>
      <h2>Privacy Policy and Consent Form</h2>
      <div>
        <ul>
          <li>Information We Collect: Username, password, e-mail,</li>
          <li>
            Why We Collect This Information: We collect this information to create and maintain your account, provide
            you with personalized task management services, and communicate with you regarding your account and our
            services.
          </li>
          <li>
            How We Use Your Information: Your information is used solely for the purposes mentioned above. We do not
            share your personal information with third parties without your explicit consent, except as required by law.
          </li>
          <li>
            Data Security: We take the security of your data seriously. Your password is encrypted, and we employ
            industry-standard security measures to protect your information from unauthorized access.
          </li>
          <li>
            Your Consent: By clicking the "Sign Up" button below, you agree to our Privacy Policy and Terms of Service.
            You consent to the collection, processing, and storage of the specified personal information.
          </li>
          <li>
            Withdrawal of Consent: You can withdraw your consent at any time by [providing instructions on how users can
            revoke their consent, e.g., contacting support@yourapp.com].
          </li>
          <li>
            Questions and Concerns: If you have any questions or concerns about our privacy practices, please contact us
            at [your contact email].
          </li>
        </ul>
        <div>
          <label>
            <input onChange={handleCheckboxChange} checked={checked} type="checkbox" />I have read and agree to the
            Privacy Policy.
          </label>
          <label>
            <input onChange={handleCheckboxChange} checked={checked} type="checkbox" />I have read and agree to the
            Terms of Service.
          </label>
        </div>
        <div>
          <button disabled={!checked} type="submit">
            I agree
          </button>
          <button /* onClick={onNo} */>I decline</button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
