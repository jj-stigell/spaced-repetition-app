import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'

export default function Tos (): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full lg:px-24 max-w-7xl md:px-12 items-center px-8">
      <div className="relative mx-auto max-w-[50rem] pt-4 pb-10">
        <div className="mb-4">
          <a className="hover:underline" onClick={() => { navigate(-1) }}>{t('modals.tos.closeButton')}</a>
        </div>
        <h1 className="text-black font-extrabold lg:text-5xl text-4xl tracking-tight">{t('modals.tos.title')}</h1>
        <p className="mt-4 text-base leading-7 text-gray-500">{t('modals.tos.lastUpdated')} 2023-12-29</p>
      </div>
      <div
        className="mx-auto max-w-[50rem] prose-base prose text-gray-500 prose-h3:text-black prose-a:font-semibold prose-a:text-accent-300 hover:prose-a:text-black">
        <p>
          This is a legal agreement between users of this service (&quot;you&quot; or &quot;your&quot;) and Yomiko. This agreement governs your usage of Yomiko.io (&quot;the service&quot;).
          In this document, &quot;we&quot; and &quot;our&quot; refers to Yomiko, its staff, and trusted third-party contractors.
        </p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Legal Age</h3>
        <p>If you are not old enough to legally agree to this document, please have a parent or guardian agree on your behalf.</p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Privacy</h3>
        <p>Please see our privacy policy to understand the information we store when you use the service, why we store it, and the limited ways in which we share it.</p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Account Expiry</h3>
        <p>As Yomiko is a free service, we need to periodically delete unused account data to keep costs down. Non-paying accounts are deleted if they are not accessed for 12 months or longer.</p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Appropriate Content</h3>
        <p>When you upload or input any material onto our website, you affirm that it does not contain:</p>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          <li>Any content that infringes intellectual property rights, including copyright, trademark, patent, or other forms of protection. While your local jurisdiction may allow the use of protected content under fair use provisions, you are not permitted to share this with others.</li>
          <li>Any content specifically created to disrupt the proper functioning of software or hardware, like viruses or code exploits.</li>
          <li>Any content that is considered illegal in European Union, the United States, or your own country of residence.</li>
        </ul>
        <p>In case you decide to make your material publicly accessible, please ensure:</p>
        <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
          <li>It does not include content that could be offensive to others, such as pornography, hate speech, or defamation.</li>
          <li>It does not attempt to alter or substitute the functionality, content, or branding of our website.</li>
        </ul>

        <h3>Using the Service</h3>
        <p>You can use Yomiko straight from your browser. This service is currently free of charge. However, we hold the right to suspend or terminate your access to the service according to our sole discretion.</p>

        <h3>Breach of Terms &amp; Legal Consequences</h3>
        <p>If you violate these terms of service, we have the right to suspend or delete your account at our discretion. If your actions are deemed illegal, we may report you to law enforcement agencies. Be aware that we are obligated to disclose your information to third parties when mandated by law.</p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Service Costs</h3>
        <p>As of now, usage of our service is free. But, as the expenses for hosting continue to rise, we might consider adopting a &quot;freemium&quot; model in the future. In this model, basic accounts would remain free, while users would have the option to pay for additional features.</p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Policy changes</h3>
        <p>If significant changes to this policy are made, we will notify you via a message when visiting the website, logging in, or via email.</p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Transfer</h3>
        <p>In the event of a company acquisition, restructure, or bankruptcy, we may transfer your data to a different legal entity. The new legal entity shall respect your privacy in the same way and notify you if they wish to use your data in a way not described here.</p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Contact</h3>
        <p>If you have any questions, please contact us via email: <a href="mailto:support@yomiko.io">support@yomiko.io</a></p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Disclaimer of Warranties</h3>
        <p className="mb-2">Use of the service is at your own risk. While we endeavor to ensure the integrity of your data, ultimately the responsibility is in your hands.</p>
        <p>THE SERVICE IS PROVIDED &quot;AS IS&quot;. WHEN ALLOWED BY LOCAL LAW, WE HEREBY DISCLAIM ALL WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTY THAT THE SERVICE WILL BE ERROR-FREE OR THAT ACCESS WILL BE CONTINUOUS OR UNINTERRUPTED. YOU UNDERSTAND THAT USE OF THE SERVICE IS ENTIRELY AT YOUR DISCRETION AND RISK.</p>

        <h3 className="mt-4 mb-2 text-2xl text-black font-extrabold dark:text-white">Limitation of Liability</h3>
        <p className="mb-10">TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY GENERAL, SPECIAL, CONSEQUENTIAL, INCIDENTAL OR OTHER DAMAGES, INCLUDING, WITHOUT LIMITATION, LOSS OF DATA, INCORRECT DATA, BUSINESS INTERRUPTION, OR ANY OTHER DAMAGES OR LOSSES INCURRED BY YOUR USE OF, OR INABILITY TO USE THIS SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, AND REGARDLESS OF THE THEORY OF LIABILITY.</p>

        <Button className="mb-16" buttonText={t('modals.tos.closeButton')} onClick={() => { navigate(-1) }} />
      </div>
    </div>
  )
}
