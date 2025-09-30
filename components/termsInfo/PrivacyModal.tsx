import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Modal } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT } from '@/constants/theme';
type PrivacyPolicyModalProps = {
  visible: boolean;
  onClose: () => void;

}
export default function PrivacyModal({visible, onClose}: PrivacyPolicyModalProps) {
  return (

    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <Animated.View 
        style={styles.modalContainer}
        // entering={FadeIn.duration(200)}
        // exiting={FadeOut.duration(200)}
      >
        <View style={styles.modalContent}>
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
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
          <Text style={styles.bodyText}>
            This Privacy Policy explains how Codec ("we," "us," or "our") collects, uses, stores, and shares ("processes") your personal information when you access or use our services ("Services"), including but not limited to when you:{"\n\n"}
            
            Download and use our mobile application (Codec), or any other application of ours that links to this Privacy Notice{"\n\n"}
            
            Use Codec. Codec is a location-based social audio app that lets users record and discover short voice notes, called Echoes, pinned to real-world places. Users can interact with Echoes left by others nearby, tag them with moods, and explore the emotional landscape of their surroundings. Codec is designed to turn any environment into a living audio space, blending location, voice, and emotion into a unique, immersive social experience{"\n\n"}
            
            Engage with us in other related ways, including any sales, marketing, or events{"\n\n"}
            
            Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at codec.echoes@gmail.com.
          </Text>

          <Text style={styles.sectionHeader}>Summary of Key Points</Text>
          
          <Text style={styles.bodyText}>
            This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.{"\n\n"}
            
            What personal information do we process? When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.{"\n\n"}
            
            Do we process any sensitive personal information? Some of the information may be considered "special" or "sensitive" in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.{"\n\n"}
            
            Do we collect any information from third parties? We do not collect any information from third parties.{"\n\n"}
            
            How do we process your information? We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.{"\n\n"}
            
            In what situations and with which parties do we share personal information? We may share information in specific situations and with specific third parties.{"\n\n"}
            
            How do we keep your information safe? We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.{"\n\n"}
            
            What are your rights? Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.{"\n\n"}
            
            How do you exercise your rights? The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
          </Text>

          <Text style={styles.sectionHeader}>1. What Information Do We Collect?</Text>
          
          <Text style={styles.subsectionHeader}>Personal information you disclose to us</Text>
          
          <Text style={styles.bodyText}>
            In Short: We collect personal information that you provide to us.{"\n\n"}
            
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.{"\n\n"}
            
            Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
          </Text>

          <View style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>• names</Text>
            <Text style={styles.bulletPoint}>• email addresses</Text>
          </View>
          
          <Text style={styles.bodyText}>
            Sensitive Information. We do not process sensitive information.{"\n\n"}
            
            Social Media Login Data. We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider.{"\n\n"}
            
            Application Data. If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:{"\n\n"}
            
            Geolocation Information. We may request access or permission to track location-based information from your mobile device, either continuously or while you are using our mobile application(s), to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device's settings.{"\n\n"}
            
            Mobile Device Data. We automatically collect device information (such as your mobile device ID, model, and manufacturer), operating system, version information and system configuration information, device and application identification numbers, browser type and version, hardware model Internet service provider and/or mobile carrier, and Internet Protocol (IP) address (or proxy server).{"\n\n"}
            
            Push Notifications. We may request to send you push notifications regarding your account or certain features of the application(s). If you wish to opt out from receiving these types of communications, you may turn them off in your device's settings.{"\n\n"}
            
            This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.{"\n\n"}
            
            All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
          </Text>

          <Text style={styles.subsectionHeader}>Information automatically collected</Text>
          
          <Text style={styles.bodyText}>
            In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.{"\n\n"}
            
            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information.{"\n\n"}
            
            Like many businesses, we also collect information through cookies and similar technologies.{"\n\n"}
            
            The information we collect includes:
          </Text>

          <View style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>• Log and Usage Data</Text>
            <Text style={styles.bulletPoint}>• Device Data</Text>
            <Text style={styles.bulletPoint}>• Location Data</Text>
          </View>
          
          <Text style={styles.bodyText}>
            Google API: Our use of information received from Google APIs will adhere to Google API Services User Data Policy, including the Limited Use requirements.
          </Text>

          <Text style={styles.sectionHeader}>2. How Do We Process Your Information?</Text>
          
          <Text style={styles.bodyText}>
            In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We process the personal information for the following purposes listed below. We may also process your information for other purposes only with your prior explicit consent.{"\n\n"}
            
            We process your personal information for a variety of reasons, depending on how you interact with our Services, including:{"\n"}
            • To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order.
          </Text>

          <Text style={styles.sectionHeader}>4. When and With Whom Do We Share Your Personal Information?</Text>
          
          <Text style={styles.bodyText}>
            In Short: We may share information in specific situations described in this section and/or with the following third parties.{"\n\n"}
            
            Vendors, Consultants, and Other Third-Party Service Providers. We may share your data with third-party vendors, service providers, contractors, or agents ("third parties") who perform services for us or on our behalf and require access to such information to do that work.{"\n\n"}
            
            The third parties we may share personal information with are as follows:
          </Text>

          <View style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>• Google account</Text>
            <Text style={styles.bulletPoint}>• Convex</Text>
            <Text style={styles.bulletPoint}>• Google Sign-In and Clerk</Text>
            <Text style={styles.bulletPoint}>• TestFlight</Text>
          </View>
          
          <Text style={styles.bodyText}>
            We also may need to share your personal information in the following situations:{"\n"}
            Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
          </Text>

          <Text style={styles.sectionHeader}>9. Do We Collect Information from Minors?</Text>
          
          <Text style={styles.bodyText}>
            In Short: We do not knowingly collect data from or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction.{"\n\n"}
            
            We do not knowingly collect, solicit data from, or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or the equivalent age as specified by law in your jurisdiction or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.{"\n\n"}
            
            If we learn that personal information from users less than 18 years of age or the equivalent age as specified by law in your jurisdiction has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18 or the equivalent age as specified by law in your jurisdiction, please contact us at codec.echoes@gmail.com.
          </Text>

          <Text style={styles.sectionHeader}>10. What Are Your Privacy Rights?</Text>
          
          <Text style={styles.bodyText}>
            In Short: Depending on your state of residence in the US or in some regions, such as Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.{"\n\n"}
            
            In some regions (like Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making.{"\n\n"}
            
            Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time.{"\n\n"}
            
            Account Information: If you would at any time like to review or change the information in your account or terminate your account, you can log in to your account settings and update your user account.{"\n\n"}
            
            Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.{"\n\n"}
            
            If you have questions or comments about your privacy rights, you may email us at codec.echoes@gmail.com.
          </Text>

          <Text style={styles.sectionHeader}>11. Controls for Do-Not-Track Features</Text>
          
          <Text style={styles.bodyText}>
            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.{"\n\n"}
            
            California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognizing or honoring DNT signals, we do not respond to them at this time.
          </Text>

          <Text style={styles.sectionHeader}>12. Do United States Residents Have Specific Privacy Rights?</Text>
          
          <Text style={styles.bodyText}>
            In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information.{"\n\n"}
            
            Categories of Personal Information We Collect:{"\n\n"}
            
            We have collected the following categories of personal information in the past twelve (12) months:
          </Text>

          <View style={styles.dataCategories}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>A. Identifiers</Text>
              <Text style={styles.categoryValue}>YES</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>B. Personal information</Text>
              <Text style={styles.categoryValue}>YES</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>C. Protected classification</Text>
              <Text style={styles.categoryValue}>YES</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>D. Commercial information</Text>
              <Text style={styles.categoryValueNo}>NO</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>E. Biometric information</Text>
              <Text style={styles.categoryValueNo}>NO</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>F. Internet activity</Text>
              <Text style={styles.categoryValueNo}>NO</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>G. Geolocation data</Text>
              <Text style={styles.categoryValue}>YES</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>H. Audio, electronic, sensory</Text>
              <Text style={styles.categoryValue}>YES</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>I. Professional information</Text>
              <Text style={styles.categoryValueNo}>NO</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>J. Education Information</Text>
              <Text style={styles.categoryValueNo}>NO</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>K. Inferences</Text>
              <Text style={styles.categoryValueNo}>NO</Text>
            </View>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>L. Sensitive personal Information</Text>
              <Text style={styles.categoryValueNo}>NO</Text>
            </View>
          </View>
          
          <Text style={styles.bodyText}>
            We will use and retain the collected personal information as needed to provide the Services or for as long as the user has an account with us.{"\n\n"}
            
            Your Rights:{"\n"}
            You have rights under certain US state data protection laws, including:
          </Text>

          <View style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>• Right to know whether we are processing your personal data</Text>
            <Text style={styles.bulletPoint}>• Right to access your personal data</Text>
            <Text style={styles.bulletPoint}>• Right to correct inaccuracies in your personal data</Text>
            <Text style={styles.bulletPoint}>• Right to request the deletion of your personal data</Text>
            <Text style={styles.bulletPoint}>• Right to obtain a copy of your personal data</Text>
            <Text style={styles.bulletPoint}>• Right to non-discrimination for exercising your rights</Text>
            <Text style={styles.bulletPoint}>• Right to opt out of targeted advertising or profiling</Text>
          </View>
          
          <Text style={styles.bodyText}>
            How to Exercise Your Rights:{"\n"}
            To exercise these rights, you can contact us by emailing us at codec.echoes@gmail.com or by referring to the contact details at the bottom of this document.{"\n\n"}
            
            California "Shine The Light" Law:{"\n"}
            California residents may request information about categories of personal information we disclosed to third parties for direct marketing purposes. Please submit your request using the contact details provided.
          </Text>

          <Text style={styles.sectionHeader}>13. Do Other Regions Have Specific Privacy Rights?</Text>
          
          <Text style={styles.bodyText}>
            In Short: You may have additional rights based on the country you reside in.{"\n\n"}
            
            Australia and New Zealand:{"\n"}
            We collect and process your personal information under Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020. At any time, you have the right to request access to or correction of your personal information.{"\n\n"}
            
            Republic of South Africa:{"\n"}
            At any time, you have the right to request access to or correction of your personal information. If you are unsatisfied with how we address any complaint, you can contact the Information Regulator (South Africa) at enquiries@inforegulator.org.za.
          </Text>

          <Text style={styles.sectionHeader}>14. Do We Make Updates to This Notice?</Text>
          
          <Text style={styles.bodyText}>
            In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.{"\n\n"}
            
            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
          </Text>

          <Text style={styles.sectionHeader}>15. How Can You Contact Us About This Notice?</Text>
          
          <Text style={styles.bodyText}>
            If you have questions or comments about this notice, you may email us at codec.echoes@gmail.com
          </Text>

          <Text style={styles.sectionHeader}>16. How Can You Review, Update, or Delete the Data We Collect from You?</Text>
          
          <Text style={styles.bodyText}>
            You have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please fill out and submit a data subject access request.
          </Text>
        </ScrollView>
      </View>
    </Animated.View>
  </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    height: '100%',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    flex: 1,
  },
  header: {
    paddingLeft: 20,
    paddingRight: 12,
    paddingVertical: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
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
    marginTop: 20,
    marginBottom: 12,
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
  dataCategories: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    fontWeight: '500',
  },
  categoryValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryValueNo: {
    fontSize: 14,
    color: '#FF5722',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 87, 34, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
});