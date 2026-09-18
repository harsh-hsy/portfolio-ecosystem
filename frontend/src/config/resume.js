// Set to true only when the CMS/API resume URL should be used.
export const useRemoteResume = false

const frontendResumeUrl = '/assets/resume/Harsh_Kumar_Singh.pdf'

export function getResumeUrl(remoteResumeUrl = '') {
  return useRemoteResume && remoteResumeUrl ? remoteResumeUrl : frontendResumeUrl
}
