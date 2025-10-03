import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Modal } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT } from '@/constants/theme';
import React from 'react';
type TermsModalProps = {
  visible: boolean;
  onClose: () => void;
}

export default function TermsModal({visible, onClose}: TermsModalProps) {
  return (
        <Modal
         visible={visible}
         animationType="slide"
         statusBarTranslucent={true}
         onRequestClose={onClose}
         presentationStyle='pageSheet'
       >
             <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Privacy Policy</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={styles.closeButtonCircle}>
                <Ionicons name="close" size={20} color={COLORS.textInverse} />
              </View>
            </TouchableOpacity>
          </View>
          
           <View style={styles.divider} />
          <ScrollView 
          
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
          <Text style={styles.sectionHeader}>Agreement to Our Legal Terms</Text>
          
          <Text style={styles.bodyText}>
            We are Codec ("Company," "we," "us," "our").{"\n\n"}
            
            We operate, as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").{"\n\n"}
            
            You can contact us by email at codec.echoes@gmail.com{"\n\n"}
            
            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Codec concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.{"\n\n"}
            
            Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change.{"\n\n"}
            
            We recommend that you print a copy of these Legal Terms for your records.
          </Text>

          <Text style={styles.sectionHeader}>1. Our Services</Text>
          
          <Text style={styles.bodyText}>
            The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
          </Text>

          <Text style={styles.sectionHeader}>2. Intellectual Property Rights</Text>
          
          <Text style={styles.subsectionHeader}>Our intellectual property</Text>
          
          <Text style={styles.bodyText}>
            We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").{"\n\n"}
            
            Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties around the world.{"\n\n"}
            
            The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use or internal business purpose only.
          </Text>

          <Text style={styles.subsectionHeader}>Your use of our Services</Text>
          
          <Text style={styles.bodyText}>
            Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to:
          </Text>

          <View style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>• access the Services; and</Text>
            <Text style={styles.bulletPoint}>• download or print a copy of any portion of the Content to which you have properly gained access,</Text>
          </View>

          <Text style={styles.bodyText}>
            solely for your personal, non-commercial use or internal business purpose.{"\n\n"}
            
            Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
          </Text>

          <Text style={styles.subsectionHeader}>Your submissions</Text>
          
          <Text style={styles.bodyText}>
            Please review this section and the "PROHIBITED ACTIVITIES" section carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.{"\n\n"}
            
            Submissions: By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.{"\n\n"}
            
            You are responsible for what you post or upload: By sending us Submissions through any part of the Services you:
          </Text>

          <View style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>• confirm that you have read and agree with our "PROHIBITED ACTIVITIES" and will not post, send, publish, upload, or transmit through the Services any Submission that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;</Text>
            <Text style={styles.bulletPoint}>• to the extent permissible by applicable law, waive any and all moral rights to any such Submission;</Text>
            <Text style={styles.bulletPoint}>• warrant that any such Submission are original to you or that you have the necessary rights and licenses to submit such Submissions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions; and</Text>
            <Text style={styles.bulletPoint}>• warrant and represent that your Submissions do not constitute confidential information.</Text>
          </View>

          <Text style={styles.bodyText}>
            You are solely responsible for your Submissions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party's intellectual property rights, or (c) applicable law.
          </Text>

          <Text style={styles.sectionHeader}>3. User Representations</Text>
          
          <Text style={styles.bodyText}>
            By using the Services, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Legal Terms; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Services through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Services for any illegal or unauthorized purpose; and (5) your use of the Services will not violate any applicable law or regulation.{"\n\n"}
            
            If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).
          </Text>

          <Text style={styles.sectionHeader}>4. Prohibited Activities</Text>
          
          <Text style={styles.bodyText}>
            You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.{"\n\n"}
            
            As a user of the Services, you agree not to:
          </Text>

          <View style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>• Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</Text>
            <Text style={styles.bulletPoint}>• Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</Text>
            <Text style={styles.bulletPoint}>• Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.</Text>
            <Text style={styles.bulletPoint}>• Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</Text>
            <Text style={styles.bulletPoint}>• Use any information obtained from the Services in order to harass, abuse, or harm another person.</Text>
            <Text style={styles.bulletPoint}>• Make improper use of our support services or submit false reports of abuse or misconduct.</Text>
            <Text style={styles.bulletPoint}>• Use the Services in a manner inconsistent with any applicable laws or regulations.</Text>
            <Text style={styles.bulletPoint}>• Engage in unauthorized framing of or linking to the Services.</Text>
            <Text style={styles.bulletPoint}>• Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Services.</Text>
            <Text style={styles.bulletPoint}>• Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</Text>
            <Text style={styles.bulletPoint}>• Delete the copyright or other proprietary rights notice from any Content.</Text>
            <Text style={styles.bulletPoint}>• Attempt to impersonate another user or person or use the username of another user.</Text>
            <Text style={styles.bulletPoint}>• Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services.</Text>
            <Text style={styles.bulletPoint}>• Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.</Text>
            <Text style={styles.bulletPoint}>• Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</Text>
            <Text style={styles.bulletPoint}>• Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.</Text>
          </View>

          <Text style={styles.sectionHeader}>8. Term and Termination</Text>
          
          <Text style={styles.bodyText}>
            These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION.{"\n\n"}
            
            If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.
          </Text>

          <Text style={styles.sectionHeader}>13. Disclaimer</Text>
          
          <Text style={styles.bodyText}>
            THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.{"\n\n"}
            
            WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES.
          </Text>

          <Text style={styles.sectionHeader}>14. Limitations of Liability</Text>
          
          <Text style={styles.bodyText}>
            IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.{"\n\n"}
            
            NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY YOU TO US. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
          </Text>

          <Text style={styles.sectionHeader}>15. Indemnification</Text>
          
          <Text style={styles.bodyText}>
            You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms; (4) your violation of the rights of a third party, including but not limited to intellectual property rights; or (5) any overt harmful act toward any other user of the Services with whom you connected via the Services.
          </Text>

          <Text style={styles.sectionHeader}>16. User Data</Text>
          
          <Text style={styles.bodyText}>
            We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.
          </Text>

          <Text style={styles.sectionHeader}>17. Electronic Communications, Transactions, and Signatures</Text>
          
          <Text style={styles.bodyText}>
            Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing.{"\n\n"}
            
            YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.
          </Text>

          <Text style={styles.sectionHeader}>19. Contact Us</Text>
          
          <Text style={styles.bodyText}>
            In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at: codec.echoes@gmail.com
          </Text>

          </ScrollView>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'flex-end',
  },

  header: {
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontFamily: FONT.family.bold,
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgb(0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.text,
    marginBottom: 20,
    fontFamily: FONT.family.regular,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: FONT.family.bold,
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },
  subsectionHeader: {
    fontSize: 16,
    fontFamily: FONT.family.bold,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  bulletContainer: {
    marginLeft: 8,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textMuted,
    marginBottom: 6,
    fontFamily: FONT.family.regular,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontFamily: FONT.family.medium,
    marginBottom: 16,
  },
});