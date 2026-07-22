import { useEffect, useId, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

import { getIconOption, iconCatalog } from "../../data/iconCatalog";

function IconPicker({
  label = "Icon",
  value,
  onChange,
  error = "",
  helpText = "",
  required = false,
  disabled = false,
}) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const rootRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = getIconOption(value);
  const SelectedIcon = selected.Icon;
  const filteredIcons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return iconCatalog;

    return iconCatalog.filter((icon) =>
      [icon.label, icon.key, icon.category, icon.keywords]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  useEffect(() => {
    if (!isOpen) return undefined;

    function closeOnOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        rootRef.current?.querySelector(".icon-picker__trigger")?.focus();
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  function selectIcon(key) {
    onChange(key);
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div
      className={`form-group icon-picker ${error ? "form-group--error" : ""}`}
      ref={rootRef}
    >
      <span className="form-label">
        {label}
        {required ? <span className="form-label__required"> *</span> : null}
      </span>

      <button
        type="button"
        className="form-input icon-picker__trigger"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-invalid={Boolean(error)}
        aria-label={`${label}: ${selected.label}`}
        disabled={disabled}
      >
        <span className="icon-picker__selected-icon" aria-hidden="true">
          <SelectedIcon />
        </span>
        <span>{selected.label}</span>
        <FiChevronDown className="icon-picker__chevron" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="icon-picker__popover">
          <label className="icon-picker__search">
            <FiSearch aria-hidden="true" />
            <span className="sr-only">Search icons</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search icons"
              autoFocus
            />
          </label>

          <div className="icon-picker__grid" id={listboxId} role="listbox">
            {filteredIcons.map((icon) => {
              const Icon = icon.Icon;
              const isSelected = icon.key === selected.key;

              return (
                <button
                  type="button"
                  className={`icon-picker__option ${isSelected ? "icon-picker__option--selected" : ""}`}
                  key={icon.key}
                  onClick={() => selectIcon(icon.key)}
                  role="option"
                  aria-selected={isSelected}
                  title={`${icon.label} - ${icon.category}`}
                >
                  <Icon aria-hidden="true" />
                  <span>{icon.label}</span>
                  <small>{icon.category}</small>
                </button>
              );
            })}
          </div>

          {filteredIcons.length === 0 ? (
            <p className="icon-picker__empty">No matching icons.</p>
          ) : null}
        </div>
      ) : null}

      {helpText ? <span className="form-help">{helpText}</span> : null}
      {error ? <span className="form-error" role="alert">{error}</span> : null}
    </div>
  );
}

export default IconPicker;
