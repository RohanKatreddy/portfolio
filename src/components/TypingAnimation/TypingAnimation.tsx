import { useState, useEffect } from 'react';
import styles from './TypingAnimation.module.css';

interface TypingAnimationProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenWords?: number;
}

export default function TypingAnimation({
  words,
  typingSpeed = 150,
  deletingSpeed = 100,
  delayBetweenWords = 2000,
}: TypingAnimationProps) {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [delta, setDelta] = useState(typingSpeed);

  useEffect(() => {
    const tick = () => {
      const i = loopNum % words.length;
      const fullText = words[i];
      const updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

      setText(updatedText);

      if (isDeleting) {
        setDelta(deletingSpeed);
      }

      if (!isDeleting && updatedText === fullText) {
        setIsDeleting(true);
        setDelta(delayBetweenWords);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setDelta(typingSpeed);
      }
    };

    const ticker = setTimeout(tick, delta);

    return () => clearTimeout(ticker);
  }, [text, delta, isDeleting, loopNum, words, typingSpeed, deletingSpeed, delayBetweenWords]);

  return (
    <span>
      {text}
      <span className={styles.cursor}>&nbsp;</span>
    </span>
  );
}

