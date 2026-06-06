export default function StageBadge({ stage, stageBg, stageColor }) {
  return (
    <span
      className="text-[11px] font-sans font-semibold px-3 py-1 rounded-full inline-block"
      style={{ background: stageBg, color: stageColor }}
    >
      {stage}
    </span>
  );
}
