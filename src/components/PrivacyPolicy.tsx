import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env";

const siteUrl =
  env.NEXT_PUBLIC_SITE_URL && "https://storysync-delta.vercel.app";

export function PrivacyPolicy() {
  const privacySections = [
    {
      title: "Interpretation and Definitions",
      content:
        "The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.",
      list: [
        "Account means a unique account created for You to access our Service or parts of our Service.",
        "Affiliate means an entity that controls, is controlled by or is under common control with a party, where 'control' means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.",
        "Company (referred to as either 'the Company', 'We', 'Us' or 'Our' in this Agreement) refers to StorySync.",
        "Cookies are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.",
        "Country refers to:  Tunisia",
        "Device means any device that can access the Service such as a computer, a cellphone or a digital tablet.",
        "Personal Data is any information that relates to an identified or identifiable individual.",
        "Service refers to the Website.",
        "Service Provider means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.",
        "Usage Data refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).",
        <span key={"site-link"}>
          Website refers to StorySync, accessible from{" "}
          <Link
            href={siteUrl}
            target="_blank"
            className="text-primary hover:underline"
          >
            {siteUrl.replace("https://", "")}
          </Link>
        </span>,
        "You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.",
      ],
    },
    {
      title: "Collecting and Using Your Personal Data",
      content:
        "While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:",
      details:
        "We collect minimal and essential information to provide our service.",
      list: ["Email address", "First name and last name", "Usage Data"],
    },
    {
      title: "Types of Data Collected",
      content: "Usage Data is collected automatically when using the Service.",
      details: "No method of transmission over the Internet is 100% secure.",
      list: [
        "Device's Internet Protocol address (e.g. IP address)",
        "Browser type",
        "Browser version",
        "The pages of our Service that You visit",
        "The time and date of Your visit",
        "The time spent on those pages",
        "Unique device identifiers",
        "Other diagnostic data",
      ],
    },
    {
      title: "Use of Your Personal Data",
      content: "The Company may use Personal Data for the following purposes:",
      list: [
        "To provide and maintain our Service",
        "To manage Your Account",
        "For the performance of a contract",
        "To contact You",
        "To provide You with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information",
        "To manage Your requests",
        "For business transfers",
        "For other purposes",
      ],
    },
    {
      title: "Retention of Your Personal Data",
      content:
        "The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy.",
      details:
        "We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations.",
      list: [
        "To comply with a legal obligation",
        "To protect and defend the rights or property of the Company",
        "To prevent or investigate possible wrongdoing in connection with the Service",
        "To protect the personal safety of Users of the Service or the public",
        "To protect against legal liability",
      ],
    },
    {
      title: "Transfer of Your Personal Data",
      content:
        "Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located.",
      details:
        "Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.",
      list: [
        "Encryption of sensitive data",
        "Regular security audits",
        "Strict access controls",
        "Compliance with data protection regulations",
      ],
    },
    {
      title: "Delete Your Personal Data",
      content:
        "You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You.",
      list: [
        "Right to access your data",
        "Right to request data deletion",
        "Right to correct inaccurate information",
        "Option to opt-out of certain data processing",
      ],
    },
    {
      title: "Disclosure of Your Personal Data",
      content:
        "We may disclose Your Personal Data in the good faith belief that such action is necessary to:",
      list: [
        "Comply with a legal obligation",
        "Protect and defend the rights or property of the Company",
        "Prevent or investigate possible wrongdoing in connection with the Service",
        "Protect the personal safety of Users of the Service or the public",
        "Protect against legal liability",
      ],
    },
    {
      title: "Security of Your Personal Data",
      content:
        "The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.",
      details:
        "We will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy.",
      list: [
        "Encryption of sensitive data",
        "Regular security audits",
        "Strict access controls",
        "Compliance with data protection regulations",
      ],
    },
    {
      title: "Children's Privacy",
      content: "Our Service does not address anyone under the age of 18.",
      list: [
        "We do not knowingly collect personally identifiable information from anyone under the age of 18",
        "If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us",
      ],
    },
    {
      title: "Links to Other Websites",
      content:
        "Our Service may contain links to other websites that are not operated by Us.",
      list: [
        "We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services",
      ],
    },
    {
      title: "Changes to this Privacy Policy",
      content: "We may update Our Privacy Policy from time to time.",
      list: [
        "We will notify You of any changes by posting the new Privacy Policy on this page",
        "We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the 'Last updated' date at the top of this Privacy Policy",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
          Privacy Policy
        </h1>
        <Badge variant="secondary" className="text-sm">
          Last Updated: March 29, 2025
        </Badge>
      </div>

      <Card className="w-full mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl text-primary">
            Protecting Your Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto px-6 py-4">
            {privacySections.map((section, index) => (
              <div key={index} className="mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <h2 className="text-lg font-semibold text-primary">
                    {section.title}
                  </h2>
                </div>

                <div className="pl-12">
                  <p className="text-muted-foreground mb-2">
                    {section.content}
                  </p>

                  {section.details && (
                    <p className="text-sm text-muted-foreground italic mb-2 bg-secondary/50 p-2 rounded">
                      {section.details}
                    </p>
                  )}

                  {section.list && (
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                      {section.list.map((item, itemIndex) => (
                        <li key={itemIndex} className="pl-2">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {index < privacySections.length - 1 && (
                  <Separator className="my-6" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          By using StorySync, you acknowledge that you have read and understood
          our Privacy Policy.
        </p>
      </div>
    </div>
  );
}
