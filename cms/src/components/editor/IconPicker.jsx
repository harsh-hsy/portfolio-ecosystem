import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown, FiSearch } from "react-icons/fi";

import { getIconOption, iconCatalog } from "../../data/iconCatalog";

const POPOVER_MAX_WIDTH = 540;
const COMPACT_POPOVER_MAX_WIDTH = 380;
const VIEWPORT_GAP = 16;

function getPopoverPosition(trigger, { compact }) {
  const rect = trigger.getBoundingClientRect();
  const maxWidth = compact ? COMPACT_POPOVER_MAX_WIDTH : POPOVER_MAX_WIDTH;
  const width = Math.min(maxWidth, window.innerWidth - VIEWPORT_GAP * 2);

  const top = rect.bottom + 8;
  const left = Math.min(
    Math.max(rect.left, VIEWPORT_GAP),
    window.innerWidth - width - VIEWPORT_GAP,
  );

  return { top, left, width };
}

function IconPicker({
  label = "Icon",
  value,
  onChange,
  error = "",
  helpText = "",
  required = false,
  disabled = false,
  compact = false,
}) {
  const generatedId = useId();
  const listboxId = `${generatedId}-listbox`;
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [popoverPosition, setPopoverPosition] = useState(null);
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
      const clickedTrigger = rootRef.current?.contains(event.target);
      const clickedPopover = popoverRef.current?.contains(event.target);
      if (!clickedTrigger && !clickedPopover) setIsOpen(false);
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    function updatePopoverPosition() {
      if (!triggerRef.current) return;
      setPopoverPosition(getPopoverPosition(triggerRef.current, { compact }));
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", updatePopoverPosition);
    window.addEventListener("scroll", updatePopoverPosition, true);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", updatePopoverPosition);
      window.removeEventListener("scroll", updatePopoverPosition, true);
    };
  }, [compact, isOpen]);

  function togglePicker() {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (!triggerRef.current) return;
    setPopoverPosition(
      getPopoverPosition(triggerRef.current, { compact }),
    );
    setIsOpen(true);
  }

  function selectIcon(key) {
    onChange(key);
    setQuery("");
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  const popover = isOpen && popoverPosition ? (
    <div
      className={`icon-picker__popover ${compact ? "icon-picker__popover--compact" : ""}`}
      ref={popoverRef}
      style={popoverPosition}
    >
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
  ) : null;

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
        ref={triggerRef}
        onClick={togglePicker}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
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

      {typeof document !== "undefined" && popover
        ? createPortal(popover, document.body)
        : null}

      {helpText ? <span className="form-help">{helpText}</span> : null}
      {error ? <span className="form-error" role="alert">{error}</span> : null}
    </div>
  );
}

export default IconPicker;
