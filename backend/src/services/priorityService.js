export const calculatePriority = ({title, content}) => {
    let score = 0;
    const text = `${title} ${content}`.toLowerCase();
 
    if (text.includes("urgent")) score += 40
    if (text.includes("deadline")) score +=30
    if (text.includes("today")) score +=20
    if (text.includes("meeting")) score +=10

}