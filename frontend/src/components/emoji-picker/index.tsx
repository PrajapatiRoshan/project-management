// EmojiPickerComponent.tsx
import React from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { customEmojis } from "./custom-emojis";

interface EmojiPickerComponentProps {
  onSelectEmoji: (emoji: string) => void;
}

const EmojiPickerComponent: React.FC<EmojiPickerComponentProps> = ({
  onSelectEmoji,
}) => {
  // Handle emoji selection
  const handleEmojiSelect = (emoji: { native: string }) => {
    console.log(emoji, "emoji");
    onSelectEmoji(emoji.native); // Pass the selected emoji to parent component
  };

  return (
    <div className="relative w-full !max-w-8">
      <Picker
        data={data}
        custom={customEmojis}
        categories={[
          "activity",
          // 'flags',
          // 'foods',
          // 'frequent',
          "objects",
          "people",
          "places",
          // 'symbols',
        ]}
        categoryIcons={{
          project_management: {
            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M57.89 397.2c-6.262-8.616-16.02-13.19-25.92-13.19c-23.33 0-31.98 20.68-31.98 32.03c0 6.522 1.987 13.1 6.115 18.78l46.52 64C58.89 507.4 68.64 512 78.55 512c23.29 0 31.97-20.66 31.97-32.03c0-6.522-1.988-13.1-6.115-18.78L57.89 397.2zM496.1 352c-44.13 0-79.72 35.75-79.72 80s35.59 80 79.72 80s79.91-35.75 79.91-80S540.2 352 496.1 352zM640 99.38c0-13.61-4.133-27.34-12.72-39.2l-23.63-32.5c-13.44-18.5-33.77-27.68-54.12-27.68c-13.89 0-27.79 4.281-39.51 12.8L307.8 159.7C262.2 192.8 220.4 230.9 183.4 273.4c-24.22 27.88-59.18 63.99-103.5 99.63l56.34 77.52c53.79-35.39 99.15-55.3 127.1-67.27c51.88-22 101.3-49.87 146.9-82.1l202.3-146.7C630.5 140.4 640 120 640 99.38z"/></svg>',
          },
          people: {
            src: "",
          },
        }}
        onEmojiSelect={handleEmojiSelect}
        emojiSize={20}
        showPreview={false}
        showSkinTones={false}
        theme="light"
        navPosition="top"
        maxFrequentRows={0}
        //emojiButtonSize={30}
        emojiButtonColors={["rgba(102, 51, 153, .2)"]}
        className=" h-[40px]"
      />
    </div>
  );
};

export default EmojiPickerComponent;
