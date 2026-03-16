export const onPreBuild = ({ netlifyConfig }) => {
  const firebaseApiKey = process.env.VITE_FIREBASE_API_KEY
  if (firebaseApiKey) {
    const existing = process.env.SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES || ''
    const values = existing ? `${existing},${firebaseApiKey}` : firebaseApiKey
    netlifyConfig.build.environment.SECRETS_SCAN_SMART_DETECTION_OMIT_VALUES = values
  }
}
