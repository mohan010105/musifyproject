import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../Contex/ThemeContext";
import { useSubscription } from "../../Contex/SubscriptionContext";
import { useAuth } from "../../Contex/AuthContex";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DB } from "../../Backend/Firebase";

const translations = {
  English: {
    title: "Settings",
    appearance: "Appearance",
    darkMode: "Dark Mode",
    playback: "Playback",
    crossfade: "Crossfade",
    autoplay: "Autoplay Next Song",
    audioQuality: "Audio Quality",
    language: "Language",
    notifications: "Notifications",
    receiveNotifications: "Receive Notifications",
    account: "Account",
    email: "Email",
    subscription: "Subscription",
    privacy: "Privacy & Security",
    makeProfilePrivate: "Make Profile Private",
    allowRequests: "Allow Friend Requests",
    upgrade: "Upgrade to Pro",
  },
  Tamil: {
    title: "அமைப்புகள்",
    appearance: "தோற்றம்",
    darkMode: "இருண்ட பயன்முறை",
    playback: "பிளேபேக்",
    crossfade: "க்ராஸ்ஃபேடு",
    autoplay: "தானாக பாடல்களை இயக்கவும்",
    audioQuality: "ஒலி தரம்",
    language: "மொழி",
    notifications: "அறிவிப்புகள்",
    receiveNotifications: "அறிவிப்புகளை பெறுங்கள்",
    account: "கணக்கு",
    email: "மின்னஞ்சல்",
    subscription: "சந்தா",
    privacy: "தனியுரிமை மற்றும் பாதுகாப்பு",
    makeProfilePrivate: "கணக்கை தனிப்பட்டதாக மாற்று",
    allowRequests: "நண்பர் கோரிக்கைகளை அனுமதிக்கவும்",
    upgrade: "ப்ரோவில் மேம்படுத்து",
  },
  Hindi: {
    title: "सेटिंग्स",
    appearance: "दिखावट",
    darkMode: "डार्क मोड",
    playback: "प्लेबैक",
    crossfade: "क्रॉसफ़ेड",
    autoplay: "स्वचालित प्लेबैक",
    audioQuality: "ऑडियो गुणवत्ता",
    language: "भाषा",
    notifications: "सूचनाएँ",
    receiveNotifications: "सूचनाएँ प्राप्त करें",
    account: "खाता",
    email: "ईमेल",
    subscription: "सदस्यता",
    privacy: "गोपनीयता और सुरक्षा",
    makeProfilePrivate: "प्रोफ़ाइल निजी बनाएँ",
    allowRequests: "मित्र अनुरोधों की अनुमति दें",
    upgrade: "प्रो में अपग्रेड करें",
  },
  Telugu: {
    title: "సెట్టింగ్‌లు",
    appearance: "ప్రదర్శన",
    darkMode: "డార్క్ మోడ్",
    playback: "ప్లేబ్యాక్",
    crossfade: "క్రాస్‌ఫేడ్",
    autoplay: "ఆటోప్లే నెక్స్ట్ సాంగ్",
    audioQuality: "ఆడియో క్వాలిటీ",
    language: "భాష",
    notifications: "నోటిఫికేషన్లు",
    receiveNotifications: "నోటిఫికేషన్లు అందుకోండి",
    account: "ఖాతా",
    email: "ఇమెయిల్",
    subscription: "సబ్‌స్క్రిప్షన్",
    privacy: "గోప్యత & భద్రత",
    makeProfilePrivate: "ప్రొఫైల్ ప్రైవేట్ చేయండి",
    allowRequests: "స్నేహితుల అభ్యర్థనలను అనుమతించండి",
    upgrade: "ప్రోకు అప్‌గ్రేడ్ చేయండి",
  },
  Kannada: {
    title: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    appearance: "ನೋಟ",
    darkMode: "ಡಾರ್ಕ್ ಮೋಡ್",
    playback: "ಪ್ಲೇಬ್ಯಾಕ್",
    crossfade: "ಕ್ರಾಸ್‌ಫೇಡ್",
    autoplay: "ಸ್ವಯಂ ಪ್ಲೇ ನೊಡಲಿ",
    audioQuality: "ಆಡಿಯೋ ಗುಣಮಟ್ಟ",
    language: "ಭಾಷೆ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    receiveNotifications: "ಅಧಿಸೂಚನೆಗಳನ್ನು ಪಡೆಯಿರಿ",
    account: "ಖಾತೆ",
    email: "ಇಮೇಲ್",
    subscription: "ಚಂದಾದಾರಿಕೆ",
    privacy: "ಗೌಪ್ಯತೆ ಮತ್ತು ಭದ್ರತೆ",
    makeProfilePrivate: "ಪ್ರೊಫೈಲ್ ಅನ್ನು ಖಾಸಗಿ ಮಾಡು",
    allowRequests: "ಸ್ನೇಹಿತ ವಿನಂತಿಗಳನ್ನು ಅನುಮತಿಸಿ",
    upgrade: "ಪ್ರೋಗೆ ಅಪ್‌ಗ್ರೇಡ್ ಮಾಡಿ",
  },
};

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode, language, toggleDarkMode, changeLanguage, loading: themeLoading } = useTheme();
  const { subscription, hasPremiumAccess } = useSubscription();
  const { authUser } = useAuth();
  const [privacySettings, setPrivacySettings] = useState({
    profilePrivate: false,
    allowRequests: true
  });

  // Load privacy settings from Firestore
  useEffect(() => {
    const loadPrivacySettings = async () => {
      if (!authUser?.uid) return;

      try {
        const userDocRef = doc(DB, 'users', authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.privacySettings) {
            setPrivacySettings(userData.privacySettings);
          }
        }
      } catch (error) {
        console.error('Error loading privacy settings:', error);
      }
    };

    loadPrivacySettings();
  }, [authUser]);

  // Save privacy settings to Firestore
  const updatePrivacySetting = async (key, value) => {
    if (!authUser?.uid) return;

    const newSettings = { ...privacySettings, [key]: value };
    setPrivacySettings(newSettings);

    try {
      const userDocRef = doc(DB, 'users', authUser.uid);
      await setDoc(userDocRef, { privacySettings: newSettings }, { merge: true });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  };

  const t = translations[language];

  if (themeLoading) {
    return <div className="w-full min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center text-white p-6 bg-gray-900">
      <h1 className="text-3xl font-bold mb-6">{t.title}</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* Language Selection */}
        <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">{t.language}</h2>
          <select
            className="mt-2 p-2 rounded-md bg-gray-700 text-white w-full"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Tamil">தமிழ்</option>
            <option value="Hindi">हिन्दी</option>
            <option value="Telugu">తెలుగు</option>
            <option value="Kannada">ಕನ್ನಡ</option>
          </select>
        </div>

        {/* Appearance */}
        <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">{t.appearance}</h2>
          <div className="flex justify-between items-center mt-2">
            <span>{t.darkMode}</span>
            <button
              className={`px-4 py-1 rounded-md ${
                darkMode ? "bg-blue-500" : "bg-gray-500"
              }`}
              onClick={toggleDarkMode}
            >
              {darkMode ? "On" : "Off"}
            </button>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">{t.privacy}</h2>
          <div className="flex justify-between items-center mt-2">
            <span>{t.makeProfilePrivate}</span>
            <button
              className={`px-4 py-1 rounded-md ${
                privacySettings.profilePrivate ? "bg-green-500" : "bg-gray-500"
              }`}
              onClick={() => updatePrivacySetting('profilePrivate', !privacySettings.profilePrivate)}
            >
              {privacySettings.profilePrivate ? "On" : "Off"}
            </button>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span>{t.allowRequests}</span>
            <button
              className={`px-4 py-1 rounded-md ${
                privacySettings.allowRequests ? "bg-green-500" : "bg-gray-500"
              }`}
              onClick={() => updatePrivacySetting('allowRequests', !privacySettings.allowRequests)}
            >
              {privacySettings.allowRequests ? "On" : "Off"}
            </button>
          </div>
        </div>

        {/* Account Details */}
        <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">{t.account}</h2>
          <p className="mt-2">{t.email}: mohanraj05@gmail.com</p>
          <p>
            {t.subscription}: {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
            {subscription.plan === 'free' && (
              <span
                className="text-blue-500 ml-2 cursor-pointer hover:underline"
                onClick={() => navigate('/payment')}
              >
                ({t.upgrade})
              </span>
            )}
          </p>
          {hasPremiumAccess() && (
            <p className="text-sm text-green-400 mt-1">
              Premium until: {subscription.endDate?.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <footer className="w-full bg-slate-800 text-white p-6 mt-10">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <h3 className="font-bold">Company</h3>
            <p>About</p>
            <p>Jobs</p>
            <p>For the Record</p>
          </div>
          <div>
            <h3 className="font-bold">Communities</h3>
            <p>For Artists</p>
            <p>Developers</p>
            <p>Advertising</p>
            <p>Investors</p>
            <p>Vendors</p>
          </div>
          <div>
            <h3 className="font-bold">Useful links</h3>
            <p>Support</p>
            <p>Free Mobile App</p>
          </div>
          <div>
            <h3 className="font-bold">Spotify Plans</h3>
            <p>Premium Individual</p>
            <p>Premium Duo</p>
            <p>Premium Family</p>
            <p>Premium Student</p>
            <p>Spotify Free</p>
          </div>
        </div>

        <div className="mt-6 flex justify-between text-xs border-t border-gray-700 pt-4">
          <div className="flex gap-4">
            <p>Legal</p>
            <p>Safety & Privacy Center</p>
            <p>Privacy Policy</p>
            <p>Cookies</p>
            <p>About Ads</p>
            <p>Accessibility</p>
          </div>
          <p>© 2025 Spotify AB</p>
        </div>
      </footer>



    </div>
  );
};

export default Settings;
