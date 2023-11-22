import { useState } from 'react'

const PrivacyPolicy = () => {
  const [ulVisible, setUlVisible] = useState(false)

  const toggleUlVisibility = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setUlVisible(!ulVisible)
  }

  return (
    <div>
      <div className="mx-auto mt-8 w-full max-w-lg p-4">
        {/* <h1 className="mb-4 text-3xl font-bold">Welcome to Petrichor!</h1>*/}
        <h2 className="mb-2 text-xl font-bold">Privacy Policy and Consent</h2>
        <div className="mb-2 text-sm">
          <button className=" mb-2 text-sm text-blue-500" onClick={toggleUlVisibility}>
            Information on Privacy Policy and Consent
          </button>
          {ulVisible && (
            <ul>
              <li>Information We Collect: Username, password, e-mail, profile picture</li>
              <li className="mb-4">
                Why We Collect This Information: We collect this information to create and maintain your account,
                provide you with personalized task management services, and communicate with you regarding your account
                and our services.
              </li>
              <li className="mb-4">
                How We Use Your Information: Your information is used solely for the purposes mentioned above. We do not
                share your personal information with third parties without your explicit consent, except as required by
                law. Aswell, we do not share your data with other users of our application.
              </li>
              <li className="mb-4">
                Data Security: We take the security of your data seriously. Your password is encrypted, and we employ
                industry-standard security measures to protect your information from unauthorized access.
              </li>
              <li className="mb-4">
                Your Consent: By clicking the "Sign Up" button below, you agree to our Privacy Policy and Terms of
                Service. You consent to the collection, processing, and storage of the specified personal information.
              </li>
              <li className="mb-4">
                Withdrawal of Consent: You can withdraw your consent at any time by deleting your account. All your data
                will be erased immediately on deleting account. If you have issues deleting your account, have questions
                or want more information, please contact us at support@petrichor.com.
              </li>
              <li className="mb-4">
                Questions and Concerns: If you have any questions or concerns about our privacy practices, please
                contact us at petrichor@gmail.com.
              </li>
            </ul>
          )}

          {/* <button className="rounded bg-red-500 px-4 py-2 text-white">I decline</button>*/}
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
