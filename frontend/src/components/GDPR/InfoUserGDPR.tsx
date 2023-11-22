const InfoUserGDPR: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
      <div className="mx-auto max-w-2xl pt-10">
        <h1 className="py-7 text-base font-semibold leading-7 text-gray-800">Privacy Policy</h1>
        <div>
          <ul className="block text-sm font-medium leading-6 text-gray-900">
            <li>Information We Collect: Username, password, e-mail, profile picture</li>
            <li className="mb-3">
              Why We Collect This Information: We collect this information to create and maintain your account, provide
              you with personalized task management services, and communicate with you regarding your account and our
              services.
            </li>
            <li className="mb-3">
              How We Use Your Information: Your information is used solely for the purposes mentioned above. We do not
              share your personal information with third parties without your explicit consent, except as required by
              law. Aswell, we do not share your data with other users of our application.
            </li>
            <li className="mb-3">
              Data Security: We take the security of your data seriously. Your password is encrypted, and we employ
              industry-standard security measures to protect your information from unauthorized access.
            </li>
            <li className="mb-3">
              Your Consent: On "Sign Up" your account, you have agreed to our Privacy Policy and Terms of Service. You
              have consent to the collection, processing, and storage of the specified personal information.
            </li>
            <li className="mb-3">
              Withdrawal of Consent: You can withdraw your consent at any time by deleting your account. All your data
              will be erased immediately on deleting account. If you have issues deleting your account, have questions
              or want more information, please contact us at support@petrichor.com.
            </li>
            <li className="mb-3">
              Questions and Concerns: If you have any questions or concerns about our privacy practices, please contact
              us at petrichor@gmail.com.
            </li>
          </ul>
        </div>
        <div className="mt-2 block text-sm font-medium leading-6 text-gray-900">
          <h1 className="pt-5 text-base font-semibold leading-7 text-gray-800">Cookies Consent</h1>
          <p className="py-2">
            This website respects your privacy and offers you a choice regarding the storage of login information:
          </p>
          <ul>
            <li>
              <h2 className="text-sm font-semibold leading-6 text-gray-900">Accept Cookies:</h2>
              <p>
                If you choose to accept cookies, we will store your login information in local storage for a more
                personalized and convenient experience.
              </p>
            </li>
            <li className="py-2">
              <h2 className="text-sm font-semibold leading-6 text-gray-900">Decline Cookies:</h2>
              <p>
                If you decline cookies, we will use session storage to store your login information for the duration of
                your current browser session, prioritizing privacy.
              </p>
            </li>
          </ul>
          <div>
            <h2 className="text-sm font-semibold leading-6 text-gray-900">Your Privacy, Your Choice</h2>
            <p>
              By using this website, you have the option to accept or decline cookies based on your preference. If you
              have declined cookies you will get the option to accept or decline cookies again at a new session. The
              reason the cookie consent reappear on declined is that you have declined saving the data in the cookie
              hence there is no data to verify that you have declined before. If you accept the cookies data will be
              saved and then there is data available to set that you don't have to accept cookies again while the app is
              running. If you close the app, cookies will be cleared and you will get asked to consent the cookies
              again.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoUserGDPR
