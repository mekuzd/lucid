import React, { useState, useEffect, useRef } from 'react';
import useFormulaStore, { suggestion, Tag } from '@/store/appStore';
import { useSuggestions } from '@/hooks/fetchSuggestion';

const FormulaInput = () => {
  const { tags, addTag, removeTag } = useFormulaStore();
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // ✅ Show dropdown on tag click
  const inputRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch suggestions
  const { data: suggestions = [], isLoading } = useSuggestions(
    'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete'
  );

  // ✅ Filter suggestions based on input or tag click
  useEffect(() => {
    if (query) {
      const filtered = suggestions.filter(
        (s: suggestion) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true); // Show dropdown when filtering
    } else {
      setFilteredSuggestions([]);
    }
  }, [query, suggestions]);

  // ✅ Handle text input
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setQuery(e.currentTarget.innerText.trim());
  };

  // ✅ Handle backspace to remove last tag
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace') {
      if (query === '' && tags.length > 0) {
        removeTag(tags[tags.length - 1].id); // Remove last tag
      } else if (query.length > 0) {
        setQuery(''); // Clear input text
        if (inputRef.current) {
          inputRef.current.innerText = ''; // Reset contentEditable field
        }
      }
    }
  };
  

  // ✅ Handle tag selection from suggestions
  const handleSuggestionClick = (suggestion: suggestion) => {
    addTag({ id: suggestion.id, name: suggestion.name, value: suggestion.value });

    if (inputRef.current) {
      inputRef.current.innerText = ''; // Clear input field
    }

    setQuery('');
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  // ✅ Handle tag click to show suggestions
  const handleTagClick = (tag: Tag) => {
    setQuery(tag.name); // Set input to tag name
    setFilteredSuggestions(
      suggestions.filter(
        (s:suggestion) => s.name.toLowerCase().includes(tag.name.toLowerCase())
      )
    );
    setShowSuggestions(true); // Show suggestions
  };

  return (
    <div className="formula-container">
      <div className="input-wrapper">
        {/* Tags */}
        <div className="tags-container">
          {tags.map((tag: Tag) => (
            <span key={tag.id} className="tag" onClick={() => handleTagClick(tag)}>
              {tag.name}
            </span>
          ))}
        </div>

        {/* Input */}
        <div
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          className="formula-input"
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="suggestions">
          {filteredSuggestions.map((s) => (
            <div key={s.id} className="suggestion" onClick={() => handleSuggestionClick(s)}>
              {s.name} ({s.category})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormulaInput;
