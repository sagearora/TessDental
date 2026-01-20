import { useState, useCallback, useRef } from "react";

export interface Selection {
  startTime: Date;
  endTime: Date;
  operatoryId: number;
}

export function useDragSelection(
  onSelectionComplete: (selection: Selection) => void,
  roundToMinutes: (date: Date) => Date
) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const startRef = useRef<{ time: Date; operatoryId: number } | null>(null);

  const handleMouseDown = useCallback(
    (time: Date, operatoryId: number) => {
      const roundedTime = roundToMinutes(time);
      startRef.current = { time: roundedTime, operatoryId };
      setIsSelecting(true);
      setSelection({
        startTime: roundedTime,
        endTime: roundedTime,
        operatoryId,
      });
    },
    [roundToMinutes]
  );

  const handleMouseMove = useCallback(
    (time: Date) => {
      if (!isSelecting || !startRef.current) return;

      const roundedTime = roundToMinutes(time);
      const startTime =
        roundedTime < startRef.current.time
          ? roundedTime
          : startRef.current.time;
      const endTime =
        roundedTime > startRef.current.time
          ? roundedTime
          : startRef.current.time;

      setSelection({
        startTime,
        endTime,
        operatoryId: startRef.current.operatoryId,
      });
    },
    [isSelecting, roundToMinutes]
  );

  const handleMouseUp = useCallback(() => {
    if (!isSelecting || !selection) return;

    if (
      selection.startTime.getTime() !== selection.endTime.getTime()
    ) {
      onSelectionComplete(selection);
    }

    setIsSelecting(false);
    setSelection(null);
    startRef.current = null;
  }, [isSelecting, selection, onSelectionComplete]);

  return {
    isSelecting,
    selection,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}
