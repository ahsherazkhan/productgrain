export type Testimonial = {
  readonly quote: string;
  readonly clientName: string;
  readonly clientRole: string;
  readonly company: string;
  readonly avatar?: string;
  readonly linkedInUrl?: string;
  readonly projectSlug?: string;
  readonly permissionConfirmed: boolean;
  readonly published: boolean;
};

export const testimonialSectionHeading =
  "What clients value about working with us";

// Intentionally empty. Testimonials are added only with exact copy and permission.
export const testimonials: readonly Testimonial[] = [];

export function getPublishedTestimonials(): readonly Testimonial[] {
  return testimonials.filter(
    (testimonial) =>
      testimonial.published && testimonial.permissionConfirmed,
  );
}
