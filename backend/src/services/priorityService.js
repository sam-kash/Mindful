export const calculatePriority = ({title, content}) => {
    let score = 0;
    const text = `${title} ${content}`.toLowerCase();
 
    if (text.includes("urgent")) score += 40
    if (text.includes("deadline")) score +=30
    if (text.includes("today")) score +=20
    if (text.includes("meeting")) score +=10

    return score;
}

export const adjustByMode = (baseScore = 0 , mode = "all") => {
  if (mode === "busy") return baseScore + 30;
  if (mode === "focus") return baseScore + 15;
  if (mode === "relaxed") return baseScore - 10;
  return baseScore;
};

export const explainPriority = ({ title = "", content = "" }) => {
  const reasons = [];
  const text = `${title} ${content}`.toLowerCase();
  let score = 0;

  if (text.includes("urgent")) {
    score += 40;
    reasons.push("Contains keyword: urgent");
  }

  if (text.includes("deadline")) {
    score += 30;
    reasons.push("Contains keyword: deadline");
  }

  if (text.includes("today")) {
    score += 20;
    reasons.push("Time-sensitive keyword: today");
  }

  if (text.includes("meeting")) {
    score += 10;
    reasons.push("Meeting-related content");
  }

  return { score, reasons };
};

