export default function SectionHeading({ eyebrow, title, description, align = "left", className = "" }) {
  const isCenter = align === "center";

  return (
    <div className={`${isCenter ? "mx-auto text-center" : "text-start"} max-w-3xl ${className}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-4 text-2xl font-semibold tracking-normal text-white sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className={`${isCenter ? "mx-auto" : ""} mt-5 max-w-2xl text-sm leading-7 text-steel sm:text-base sm:leading-8`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
