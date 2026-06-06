export function isHostingerDomain() {
  if (typeof window === "undefined") return false;

  return (
    window.location.hostname === "firstinteriors.in" ||
    window.location.hostname === "www.firstinteriors.in"
  );
}

export function getSectionHref(sectionId: string) {
  return isHostingerDomain() ? `/#/?section=${sectionId}` : `/#${sectionId}`;
}
