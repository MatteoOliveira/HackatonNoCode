import type { StepProps } from "../types";
import StepImage from "../StepImage";

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  padding: "1rem",
  borderRadius: "0.75rem",
  border: "none",
  backgroundColor: "#f0f0f0",
  fontSize: "1rem",
  fontFamily: "inherit",
  outline: "none",
  color: "var(--color-noir)",
};

export default function Step1({ data, update }: StepProps) {
  return (
    <div>
      <StepImage
        src="/images/onboarding-sport.jpg"
        alt="Joueuse de badminton en action"
        fallbackBg="var(--color-bleu-fonce)"
        fallbackEmoji="🏸"
      />

      <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-noir)" }}>
        Comment devons nous t&apos;appeler&nbsp;?
      </h2>
      <p className="text-sm opacity-50 mb-5" style={{ color: "var(--color-noir)" }}>
        Utilise le nom avec lequel tu te sens le plus à l&apos;aise, nous n&apos;avons
        pas besoin de ton identité officielle pour faire du sport ensemble.
      </p>

      <input
        type="text"
        value={data.pseudo}
        onChange={(e) => update({ pseudo: e.target.value })}
        placeholder="Ton prénom ou pseudo"
        style={INPUT_STYLE}
        autoComplete="nickname"
        aria-label="Ton prénom ou pseudo"
      />

      <h3 className="text-xl font-bold mt-7 mb-5" style={{ color: "var(--color-noir)" }}>
        Maintenant renseigne ton adresse et ton mot de passe&nbsp;:
      </h3>

      <div className="flex flex-col gap-3">
        <input
          type="email"
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="Ton adresse email"
          style={INPUT_STYLE}
          autoComplete="email"
          aria-label="Ton adresse email"
        />
        <input
          type="password"
          value={data.password}
          onChange={(e) => update({ password: e.target.value })}
          placeholder="Ton mot de passe"
          style={INPUT_STYLE}
          autoComplete="new-password"
          aria-label="Ton mot de passe"
        />
      </div>
    </div>
  );
}
