import { Progress } from "@/components/ui/progress";


interface descriptionProps {
  text: string;
  max: number;
}

const TruncatedText = ({ text, max }: descriptionProps) => {
  return text.length > max ? text.slice(0, max) + '...' : text;
};

const Agent = () => {
  const description =
    'Create a pull request that fixes the navbar styling by aligning all items properly, improving responsiveness across breakpoints, cleaning up unused styles, and making hover/active states consistent with the existing theme. Update only the relevant components and style files, follow the project’s current patterns, generate clean minimal diffs, create a new branch for the fix, write a clear commit message, and open a PR titled “Fix: Navbar Styling Improvements” with a concise description of what was changed and why.';

  return (
    <div className="border-3 w-full max-w-2xl my-8 rounded-xl bg-zinc-800">
      <div className="p-2">
        <h1 className="text-lg text-semibold py-2">Runnig your query</h1>
        <p className="text-xs">
          <TruncatedText text={description} max={500} />
        </p>
      </div>

      <div className="p-2 pb-3 ">
        <Progress value={33}/>
      </div>
    </div>
  );
};

export default Agent;
