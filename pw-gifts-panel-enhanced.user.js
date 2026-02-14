// ==UserScript==
// @name         PW Gifts Panel Enhanced
// @namespace    pw-gifts-panel
// @version      3.9.3
// @description  Панель выбора персонажа, подарков и автозапуск с последовательной AJAX-передачей
// @match        https://pwonline.ru/promo_items.php
// @match        https://pwonline.ru/promo_items.php?do=activate&cart_id=*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ==========================
    // СТИЛИ
    // ==========================
    const panelStyles = `
    /* Основные стили панели */
	.pw-theme-dark {
		/* Основные цвета фона */
		--pw-bg-primary: #1a1a1a;
		--pw-bg-secondary: #222;
		--pw-bg-panel: #2a2a2a;
		--pw-bg-dark: #1e1e1e;
		--pw-bg-darker: #252525;
		--pw-bg-medium: #333;
		--pw-bg-light: #3a3a3a;
		--pw-bg-lighter: #444;

		/* Цвета текста */
		--pw-text-primary: #fff;
		--pw-text-secondary: #ddd;
		--pw-text-muted: #ccc;
		--pw-text-disabled: #888;
		--pw-text-light: #eee;
		--pw-button-text: #fff;

		/* Цвета границ и разделителей */
		--pw-border-dark: #333;
		--pw-border-medium: #444;
		--pw-border-light: #555;
		--pw-divider: #444;

		/* Акцентные цвета */
		--pw-accent-blue: #3498db;
		--pw-accent-blue-dark: #2980b9;
		--pw-accent-blue-darker: #2573a7;

		--pw-accent-yellow: #f1c40f;
		--pw-accent-yellow-dark: #f39c12;
		--pw-accent-yellow-darker: #e67e22;

		--pw-accent-red: #e74c3c;
		--pw-accent-red-dark: #c0392b;
		--pw-accent-red-darker: #a93226;

		--pw-accent-green: #2ecc71;
		--pw-accent-green-dark: #27ae60;
		--pw-accent-green-darker: #229954;

		--pw-accent-purple: #9b59b6;
		--pw-accent-purple-dark: #8e44ad;
		--pw-accent-purple-darker: #7d3c98;

		/* Цвета для состояний */
		--pw-success: #4CAF50;
		--pw-success-dark: #45a049;
		--pw-error: #f44336;
		--pw-error-dark: #d32f2f;
		--pw-warning: #f1c40f;
		--pw-warning-dark: #f39c12;
		--pw-button-hover: #666;

		/* Тени и наложения */
		--pw-shadow-color: rgba(0, 0, 0, 0.3);
		--pw-shadow-dark: rgba(0, 0, 0, 0.6);
		--pw-overlay: rgba(0, 0, 0, 0.7);
		--pw-overlay-light: rgba(255, 255, 255, 0.1);
		--pw-overlay-white: rgba(255, 255, 255, 0.2);

		/* Эффекты */
		--pw-glow-blue: rgba(52, 152, 219, 0.3);
		--pw-glow-green: rgba(76, 175, 80, 0.3);
		--pw-glow-red: rgba(244, 67, 54, 0.3);
		--pw-glow-yellow: rgba(241, 196, 15, 0.3);
		--pw-focus-ring: rgba(52, 152, 219, 0.2);

		/* Специальные цвета */
		--pw-purple-light: rgba(155, 89, 182, 0.1);
		--pw-blue-light: rgba(52, 152, 219, 0.1);
	}

	.pw-theme-light {
		/* Основные цвета фона - светлая тема */
		--pw-bg-primary: #F6F1E6;
		--pw-bg-secondary: #F0E8DC;
		--pw-bg-panel: #F9F5EC;
		--pw-bg-dark: #E8DFD0;
		--pw-bg-darker: #DFD6C8;
		--pw-bg-medium: #EDE6D8;
		--pw-bg-light: #F3EDE2;
		--pw-bg-lighter: #D8CFC0;

		/* Цвета текста - тёмные для светлого фона */
		--pw-text-primary: #2C3E50;
		--pw-text-secondary: #34495E;
		--pw-text-muted: #7F8C8D;
		--pw-text-disabled: #95A5A6;
		--pw-text-light: #FFFFFF;
		--pw-button-text: #000000;

		/* Цвета границ и разделителей */
		--pw-border-dark: #D1C7B7;
		--pw-border-medium: #C5BBAB;
		--pw-border-light: #B8AD9D;
		--pw-divider: #C5BBAB;

		/* Акцентные цвета - сохранены оригинальные, но более насыщенные */
		--pw-accent-blue: #2980B9;
		--pw-accent-blue-dark: #2472A4;
		--pw-accent-blue-darker: #1F618D;

		--pw-accent-yellow: #F39C12;
		--pw-accent-yellow-dark: #E67E22;
		--pw-accent-yellow-darker: #D35400;

		--pw-accent-red: #E74C3C;
		--pw-accent-red-dark: #C0392B;
		--pw-accent-red-darker: #A93226;

		--pw-accent-green: #27AE60;
		--pw-accent-green-dark: #229954;
		--pw-accent-green-darker: #1E8449;

		--pw-accent-purple: #8E44AD;
		--pw-accent-purple-dark: #7D3C98;
		--pw-accent-purple-darker: #6C3483;

		/* Цвета для состояний */
		--pw-success: #27AE60;
		--pw-success-dark: #229954;
		--pw-error: #E74C3C;
		--pw-error-dark: #C0392B;
		--pw-warning: #F39C12;
		--pw-warning-dark: #E67E22;
		--pw-button-hover: #666;

		/* Тени и наложения - более светлые */
		--pw-shadow-color: rgba(0, 0, 0, 0.1);
		--pw-shadow-dark: rgba(0, 0, 0, 0.15);
		--pw-overlay: rgba(0, 0, 0, 0.4);
		--pw-overlay-light: rgba(255, 255, 255, 0.3);
		--pw-overlay-white: rgba(255, 255, 255, 0.8);

		/* Эффекты */
		--pw-glow-blue: rgba(41, 128, 185, 0.15);
		--pw-glow-green: rgba(39, 174, 96, 0.15);
		--pw-glow-red: rgba(231, 76, 60, 0.15);
		--pw-glow-yellow: rgba(243, 156, 18, 0.15);
		--pw-focus-ring: rgba(41, 128, 185, 0.25);

		/* Специальные цвета */
		--pw-purple-light: rgba(142, 68, 173, 0.08);
		--pw-blue-light: rgba(41, 128, 185, 0.08);
	}

	.pw-panel {
		position: fixed;
		width: 380px;
		min-width: 380px;
		max-width: 380px;
		top: 60px;
		right: 0;
		background: linear-gradient(145deg, var(--pw-bg-primary) 0%, var(--pw-bg-secondary) 100%);
		color: var(--pw-text-primary);
		padding: 12px;
		z-index: 9999;
		font-size: 14px;
		border-radius: 8px 0 0 8px;
		box-sizing: border-box;
		transition: transform 0.3s ease;
		transform: translateX(0);
		cursor: default !important;
		border: 2px solid var(--pw-border-dark);
		border-right: none;
		box-shadow: 0 4px 15px var(--pw-shadow-color);
	}

	.pw-panel.hidden {
		transform: translateX(100%);
	}

	.pw-panel-toggle {
		position: fixed;
		top: 65px;
		right: 380px;
		width: 24px;
		height: 48px;
		background: linear-gradient(145deg, var(--pw-bg-lighter) 0%, var(--pw-bg-medium) 100%);
		color: var(--pw-text-primary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px 0 0 8px;
		z-index: 10000;
		box-shadow: 0 2px 5px var(--pw-shadow-color);
		border: 1px solid var(--pw-border-light);
		border-right: none;
		transition: all 0.3s ease;
		font-size: 16px;
		font-weight: bold;
	}

	.pw-panel-toggle.hidden {
		right: 0;
	}

	.pw-panel-select {
		width: 100%;
        height: 40px;
		margin-bottom: 8px;
		padding: 8px 10px;
		font-size: 13px;
		box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
		cursor: pointer !important;
		background: var(--pw-bg-panel);
		border: 1px solid var(--pw-bg-lighter);
		color: var(--pw-text-primary);
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.pw-panel-select:hover {
		border-color: var(--pw-border-light);
	}

	.pw-panel-checkbox {
		vertical-align: middle;
		margin-right: 6px;
		cursor: pointer !important;
		accent-color: var(--pw-accent-blue);
	}

	.pw-panel-label {
		cursor: pointer !important;
		display: inline-block;
		max-width: 300px;
		word-wrap: break-word;
		white-space: normal;
		vertical-align: middle;
		line-height: 1.4;
		color: var(--pw-text-secondary);
		font-size: 13px;
	}

	.pw-panel-button {
		height: 40px;
		width: 100%;
		padding: 2px;
		font-size: 13px;
		cursor: pointer !important;
		background: var(--pw-bg-medium);
		color: var(--pw-button-text);
        border: 1px solid var(--pw-border-dark);
		border-radius: 4px;
		transition: all 0.2s ease;
		font-weight: 500;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
	}

	.pw-panel-button:hover {
		background: var(--pw-button-hover);
		transform: translateY(-1px);
		box-shadow: 0 4px 8px var(--pw-shadow-color);
	}

	.pw-panel-button.primary {
		background: linear-gradient(145deg, var(--pw-accent-blue) 0%, var(--pw-accent-blue-dark) 100%);
	}

	.pw-panel-button.primary:hover {
		background: linear-gradient(145deg, var(--pw-accent-blue-dark) 0%, var(--pw-accent-blue-darker) 100%);
	}

	.pw-panel-button.warning {
		background: linear-gradient(145deg, var(--pw-accent-yellow) 0%, var(--pw-accent-yellow-dark) 100%);
	}

	.pw-panel-button.warning:hover {
		background: linear-gradient(145deg, var(--pw-accent-yellow-dark) 0%, var(--pw-accent-yellow-darker) 100%);
	}

	.pw-panel-button.danger {
		background: linear-gradient(145deg, var(--pw-accent-red) 0%, var(--pw-accent-red-dark) 100%);
	}

	.pw-panel-button.danger:hover {
		background: linear-gradient(145deg, var(--pw-accent-red-dark) 0%, var(--pw-accent-red-darker) 100%);
	}

	.pw-panel-button.success {
		background: linear-gradient(145deg, var(--pw-accent-green) 0%, var(--pw-accent-green-dark) 100%);
	}

	.pw-panel-button.success:hover {
		background: linear-gradient(145deg, var(--pw-accent-green-dark) 0%, var(--pw-accent-green-darker) 100%);
	}

	.pw-panel-button.purple {
		background: linear-gradient(145deg, var(--pw-accent-purple) 0%, var(--pw-accent-purple-dark) 100%);
	}

	.pw-panel-button.purple:hover {
		background: linear-gradient(145deg, var(--pw-accent-purple-dark) 0%, var(--pw-accent-purple-darker) 100%);
	}

	.pw-panel-input {
		padding: 6px 8px;
		background: var(--pw-bg-panel);
		border: 1px solid var(--pw-bg-lighter);
		color: var(--pw-text-primary);
		border-radius: 4px;
		font-size: 12px;
		transition: all 0.2s ease;
	}

	.pw-panel-input:focus {
		border-color: var(--pw-accent-blue);
		outline: none;
		box-shadow: 0 0 0 2px var(--pw-focus-ring);
	}

	.pw-panel-input.number {
		width: 50px;
	}

	.pw-panel-divider {
		width: 100%;
		margin: 12px 0;
		border: none;
		border-top: 1px solid var(--pw-divider);
		cursor: default !important;
	}

	.pw-panel-container {
		display: flex;
		gap: 5px;
	}

	.pw-panel-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
		gap: 5px;
	}

	.pw-panel-row.center {
		align-items: center;
	}

	.pw-panel-flex {
		display: flex;
		gap: 10px;
		flex-wrap: nowrap;
	}

	.pw-panel-flex-item {
		flex: 1;
		min-width: 0;
	}

	.pw-panel-icon-button {
		padding: 0;
		background: var(--pw-bg-medium);
		color: var(--pw-button-text);
		border: 1px solid var(--pw-border-dark);
		border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		font-size: 18px;
		flex-shrink: 0;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.pw-panel-icon-button:hover {
		background: var(--pw-button-hover);
		transform: scale(1.05);
	}

	.pw-panel-icon-button.blue {
		background: var(--pw-accent-blue);
	}

	.pw-panel-icon-button.blue:hover {
		background: var(--pw-accent-blue-dark);
	}

	.pw-panel-icon-button.yellow {
		background: var(--pw-accent-yellow);
	}

	.pw-panel-icon-button.yellow:hover {
		background: var(--pw-accent-yellow-dark);
	}

	.pw-panel-icon-button.red {
		background: var(--pw-accent-red);
	}

	.pw-panel-icon-button.red:hover {
		background: var(--pw-accent-red-dark);
	}

	/* Стили для модальных окон */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--pw-overlay);
		z-index: 20000;
		display: none;
		justify-content: center;
		align-items: center;
		cursor: default !important;
	}

	.modal-overlay.active {
		display: flex;
	}

	.modal-content {
		background: linear-gradient(145deg, var(--pw-bg-panel) 0%, var(--pw-bg-dark) 100%);
		border-radius: 12px;
		width: 90%;
		max-width: 800px;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		box-shadow: 0 15px 35px var(--pw-shadow-dark);
		border: 2px solid var(--pw-bg-lighter);
	}

	.modal-header {
		background: linear-gradient(145deg, var(--pw-bg-medium) 0%, var(--pw-bg-panel) 100%);
		padding: 18px 24px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--pw-divider);
	}

	.modal-title {
		margin: 0;
		color: var(--pw-text-primary);
		font-size: 18px;
		font-weight: bold;
		cursor: default !important;
		text-shadow: 0 1px 2px var(--pw-shadow-color);
	}

	.modal-close {
		background: var(--pw-bg-lighter);
		border: none;
		color: var(--pw-text-primary);
		font-size: 24px;
		cursor: pointer;
		padding: 0;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		transition: all 0.2s ease;
	}

	.modal-close:hover {
		background: var(--pw-border-light);
		transform: scale(1.1);
	}

	.modal-body {
		padding: 20px;
		overflow-y: auto;
		flex-grow: 1;
		max-height: 60vh;
		cursor: default !important;
		background: var(--pw-bg-panel);
	}

	.modal-footer {
		padding: 15px 20px;
		background: linear-gradient(145deg, var(--pw-bg-medium) 0%, var(--pw-bg-panel) 100%);
		border-top: 1px solid var(--pw-divider);
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	/* Кастомный скроллбар */
	.pw-scrollbar::-webkit-scrollbar {
		width: 10px;
		height: 10px;
		cursor: pointer !important;
	}

	.pw-scrollbar::-webkit-scrollbar-track {
		background: var(--pw-bg-primary);
		border-radius: 5px;
	}

	.pw-scrollbar::-webkit-scrollbar-thumb {
		background: linear-gradient(145deg, var(--pw-border-light) 0%, var(--pw-bg-lighter) 100%);
		border-radius: 5px;
		border: 2px solid var(--pw-bg-primary);
		cursor: pointer !important;
	}

	.pw-scrollbar::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(145deg, #666 0%, var(--pw-border-light) 100%);
	}

	.pw-scrollbar::-webkit-scrollbar-corner {
		background: var(--pw-bg-primary);
	}

	/* Стили для групп предметов */
	.gift-group {
		background: var(--pw-bg-medium);
		border-radius: 6px;
		margin-bottom: 15px;
		overflow: hidden;
		border: 1px solid var(--pw-bg-lighter);
		cursor: default !important;
	}

	.group-header {
		padding: 12px 15px;
		background: var(--pw-bg-light);
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.group-header:hover {
		background: var(--pw-bg-lighter);
	}

	.group-title {
		display: flex;
		align-items: center;
		gap: 15px;
		flex-grow: 1;
	}

	.group-toggle {
		background: var(--pw-border-light);
		border: none;
		color: var(--pw-text-primary);
		font-size: 12px;
		cursor: pointer;
		padding: 4px 8px;
		border-radius: 3px;
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 0.2s ease;
	}

	.group-toggle:hover {
		background: #666;
	}

	.group-name-input {
		background: transparent;
		border: 1px solid var(--pw-border-light);
		color: var(--pw-text-primary);
		padding: 6px 10px;
		border-radius: 3px;
		font-size: 14px;
		flex-grow: 1;
		min-width: 0;
		cursor: text !important;
		transition: all 0.2s ease;
	}

	.group-name-input:focus {
		border-color: var(--pw-accent-blue);
		outline: none;
	}

	.group-controls {
		display: flex;
		gap: 8px;
		flex-shrink: 0;
	}

	.group-items {
		padding: 15px;
		display: block;
		border-top: 1px solid var(--pw-bg-lighter);
		cursor: default !important;
	}

	.item-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 10px;
		margin-bottom: 8px;
		background: var(--pw-bg-light);
		border-radius: 4px;
		transition: all 0.2s ease;
		cursor: default !important;
	}

	.item-row:hover {
		background: var(--pw-bg-lighter);
	}

	.item-input {
		flex-grow: 1;
		background: var(--pw-bg-panel);
		border: 1px solid var(--pw-border-light);
		color: var(--pw-text-primary);
		padding: 8px 12px;
		border-radius: 3px;
		font-size: 13px;
		min-width: 0;
		cursor: text !important;
		transition: all 0.2s ease;
	}

	.item-input:focus {
		border-color: var(--pw-accent-blue);
		outline: none;
	}

	/* Стили для сообщений */
	.pw-message {
		position: fixed;
		top: 20px;
		right: 20px;
		color: white;
		padding: 18px 28px;
		border-radius: 10px;
		z-index: 10000;
		font-weight: bold;
		font-size: 14px;
		animation: slideInRight 0.3s ease-out;
		max-width: 400px;
		white-space: pre-line;
		cursor: default !important;
		border: 1px solid var(--pw-overlay-white);
		backdrop-filter: blur(5px);
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.pw-message.success {
		background: linear-gradient(145deg, var(--pw-success) 0%, var(--pw-success-dark) 100%);
		box-shadow: 0 6px 20px var(--pw-glow-green);
	}

	.pw-message.error {
		background: linear-gradient(145deg, var(--pw-error) 0%, var(--pw-error-dark) 100%);
		box-shadow: 0 6px 20px var(--pw-glow-red);
	}

	.pw-message.warning {
		background: linear-gradient(145deg, var(--pw-accent-yellow) 0%, var(--pw-accent-yellow-dark) 100%);
		box-shadow: 0 6px 20px var(--pw-glow-yellow);
	}

	.pw-message-icon {
		width: 24px;
		height: 24px;
		background: var(--pw-overlay-white);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		flex-shrink: 0;
	}

	.pw-message-content {
		flex-grow: 1;
	}

	@keyframes slideInRight {
		from { transform: translateX(100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}

	@keyframes fadeOut {
		from { opacity: 1; transform: translateX(0); }
		to { opacity: 0; transform: translateX(20px); }
	}

	/* Стили для загрузчика */
	.pw-loader {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.9) 100%);
		color: white;
		padding: 25px 35px;
		border-radius: 12px;
		z-index: 10001;
		font-weight: bold;
		font-size: 16px;
		text-align: center;
		box-shadow: 0 8px 25px var(--pw-shadow-dark);
		min-width: 250px;
		cursor: default !important;
		border: 1px solid var(--pw-overlay-light);
		backdrop-filter: blur(5px);
	}

	.loader-spinner {
		display: inline-block;
		width: 40px;
		height: 40px;
		border: 4px solid rgba(52, 152, 219, 0.3);
		border-radius: 50%;
		border-top-color: var(--pw-accent-blue);
		animation: spin 1s ease-in-out infinite;
		box-shadow: 0 0 10px var(--pw-glow-blue);
		margin-bottom: 15px;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* Новые стили для замены инлайн-стилей */
	.delay-type-container {
		margin-bottom: 25px;
	}

	.delay-type-title {
		color: var(--pw-text-primary);
		margin-top: 0;
		margin-bottom: 15px;
		font-size: 14px;
		font-weight: bold;
		cursor: default !important;
	}

	.radio-container {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.radio-label {
		display: flex;
        height: 30px;
		align-items: center;
		gap: 10px;
		cursor: pointer !important;
		padding: 8px 12px;
		border-radius: 4px;
		background: var(--pw-bg-medium);
		transition: background 0.2s;
	}

	.radio-label:hover {
		background: var(--pw-bg-light);
	}

	.radio-input {
		cursor: pointer !important;
		margin: 0;
	}

	.radio-text {
		color: var(--pw-text-muted);
		font-size: 14px;
		cursor: pointer !important;
	}

	.delay-input {
		width: 80px;
		padding: 6px 8px;
		background: var(--pw-bg-panel);
		border: 1px solid var(--pw-border-light);
		color: var(--pw-text-primary);
		border-radius: 4px;
		font-size: 14px;
		margin-left: auto;
		cursor: text !important;
	}

	.delay-input:disabled {
		border-color: var(--pw-bg-medium);
		color: var(--pw-text-disabled);
		cursor: not-allowed !important;
	}

	.delay-unit {
		color: var(--pw-text-disabled);
		font-size: 14px;
		margin-left: 5px;
		cursor: default !important;
	}

	.dash {
		color: var(--pw-text-disabled);
		font-size: 14px;
		margin: 0 5px;
		cursor: default !important;
	}

	.description-container {
		margin-bottom: 25px;
		padding: 15px;
		background: var(--pw-purple-light);
		border-radius: 6px;
		border-left: 4px solid var(--pw-accent-purple);
	}

	.description-title {
		color: var(--pw-accent-purple);
		margin-top: 0;
		margin-bottom: 10px;
		font-size: 14px;
		font-weight: bold;
		cursor: default !important;
	}

	.description-list {
		margin: 0;
		padding-left: 20px;
		color: var(--pw-text-muted);
		font-size: 13px;
		line-height: 1.5;
		cursor: default !important;
	}

	.help-container {
		margin-bottom: 25px;
	}

	.help-title {
		color: var(--pw-success);
		margin-top: 0;
		margin-bottom: 10px;
		font-size: 16px;
		cursor: default !important;
	}

	.help-text {
		cursor: default !important;
	}

	.help-important {
		background: var(--pw-bg-medium);
		border-radius: 6px;
		padding: 15px;
		margin: 15px 0;
		border-left: 4px solid var(--pw-accent-blue);
		cursor: default !important;
	}

	.help-subtitle {
		color: var(--pw-accent-blue);
		margin-top: 0;
		margin-bottom: 10px;
		cursor: default !important;
	}

	.help-list {
		padding-left: 20px;
		margin: 10px 0;
		cursor: default !important;
	}

	.help-hr {
		margin: 25px 0;
		border: none;
		border-top: 1px solid var(--pw-divider);
		cursor: default !important;
	}

	.help-center {
		text-align: center;
		color: var(--pw-text-disabled);
		font-size: 12px;
		cursor: default !important;
	}

	.note-box {
		background: var(--pw-purple-light);
		border-left: 3px solid var(--pw-accent-purple);
		padding: 10px;
		margin: 15px 0;
		cursor: default !important;
	}

	.max-items-container {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.max-items-label {
		font-size: 12px;
		color: var(--pw-text-muted);
		white-space: nowrap;
		cursor: default !important;
	}

	.reload-container {
		display: flex;
		align-items: center;
		gap: 5px;
		line-height: 1.4;
		cursor: pointer !important;
	}

	.reload-label {
		font-size: 12px;
		max-width: 180px;
	}

	.auto-container {
		margin-bottom: 8px;
		text-align: left;
		line-height: 1.4;
		cursor: pointer !important;
	}

	.apply-button-container {
		margin-bottom: 8px;
		text-align: right;
	}

	.sequential-container {
		margin-top: 8px;
		margin-bottom: 8px;
	}

	.btn-sequential {
		width: 100%;
	}

	.btn-check {
		flex: 1;
	}

	.btn-chests {
		flex: 1;
	}
    `;

    // Добавляем стили в head документа
    (function addStyles() {
        const style = document.createElement('style');
        style.textContent = panelStyles;
        document.head.appendChild(style);
    })();

    // ==========================
    // CONSTANTS & STORAGE KEYS
    // ==========================
    const STORAGE_SHARDS = 'tm_shards_data_v3';
    const STORAGE_SELECTED = 'tm_shards_selected_v3';
    const STORAGE_AUTOINSTALL = 'tm_autoinstall_v2';
    const STORAGE_SEQUENTIAL_RELOAD = 'tm_sequential_reload_v1';
    const STORAGE_SEQUENTIAL_MAX_TOTAL_ITEMS = 'tm_sequential_max_total_items_v1';
    const STORAGE_PANEL_HIDDEN = 'tm_panel_hidden_v1';
    const STORAGE_GIFT_TYPES = 'tm_gift_types_v1';
    const STORAGE_CHEST_AUTO_CLOSE = 'tm_chest_auto_close_v1';
    const STORAGE_CHEST_DELAY_TYPE = 'tm_chest_delay_type_v1';
    const STORAGE_CHEST_FIXED_DELAY = 'tm_chest_fixed_delay_v1';
    const STORAGE_CHEST_RANDOM_MIN = 'tm_chest_random_min_v1';
    const STORAGE_CHEST_RANDOM_MAX = 'tm_chest_random_max_v1';

    const MAX_ITEMS_PER_BATCH = 5;
    const DEFAULT_MAX_TOTAL_ITEMS = 20;
    const DEFAULT_GIFT_TYPES = [
        { name: 'Самоцветы и камни жребия', targets: ['Самоцвет грез (оружие)', 'Самоцвет грез (реликвия)', 'Самоцвет грез (доспех)', 'Серебряный камень жребия  x5', 'Серебряный камень жребия x5'] },
        { name: 'Талон на платиновый амулет', targets: ['Талон на платиновый амулет'] },
        { name: 'Талон на платиновый идол', targets: ['Талон на платиновый идол'] }
    ];

    // Константы для задержки открытия окон сундуков
    const CHEST_DELAY_TYPES = {
        NONE: 'none',
        FIXED: 'fixed',
        RANDOM: 'random'
    };
    const DEFAULT_DELAY_TYPE = CHEST_DELAY_TYPES.RANDOM;
    const DEFAULT_FIXED_DELAY = 100; // мс
    const DEFAULT_RANDOM_MIN = 50; // мс
    const DEFAULT_RANDOM_MAX = 200; // мс

    // Глобальные переменные
    let panelSelect, autoCheckbox, giftSelect, sequentialReloadCheckbox, maxTotalItemsInput;
    let panel, toggle;
    let currentGiftTypes = [];

    // Настройки задержки открытия сундуков
    let chestDelayType = DEFAULT_DELAY_TYPE;
    let chestFixedDelay = DEFAULT_FIXED_DELAY;
    let chestRandomMin = DEFAULT_RANDOM_MIN;
    let chestRandomMax = DEFAULT_RANDOM_MAX;

    // Флаги для перезагрузки
    let shouldReloadAfterAjaxTransfer = false;
    let shouldReloadAfterSequential = false;

    // Настройки последовательной передачи
    let maxTotalItems = DEFAULT_MAX_TOTAL_ITEMS;
    let currentGroupIndex = 0;
    let totalGroups = 0;
    let allItemGroups = [];
    let isSequentialTransferActive = false;

    // Переменные для работы с сундуками
    let chestWindows = [];
    let chestsToProcess = [];
    let isProcessingChests = false;
    let chestAutoCloseTimeout = 5000; // 5 секунд

    let attempts = 0;
    const MAX_ATTEMPTS = 3;
    const DELAY = 2000;

	// ==========================
	// ФУНКЦИИ ДЛЯ ПЕРЕКЛЮЧЕНИЯ ТЕМ
	// ==========================

	const STORAGE_THEME = 'tm_panel_theme_v1';
	let currentTheme = 'dark'; // Добавляем глобальную переменную

	/**
	 * Загружает сохранённую тему
	 */
	function loadTheme() {
		const savedTheme = localStorage.getItem(STORAGE_THEME);
		if (savedTheme) {
			applyTheme(savedTheme);
		}
	}

	/**
	 * Применяет указанную тему
	 */
	function applyTheme(theme) {
		const body = document.body;

		// Удаляем все классы тем
		body.classList.remove('pw-theme-dark', 'pw-theme-light');

		// Добавляем класс текущей темы
		body.classList.add(`pw-theme-${theme}`);

		currentTheme = theme;
		localStorage.setItem(STORAGE_THEME, theme);

		// Обновляем иконку кнопки
		updateThemeButtonIcon(theme);
	}

	/**
	 * Переключает тему на противоположную
	 */
	function toggleTheme() {
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

		// Применяем новую тему к body
		const body = document.body;
		body.classList.remove('pw-theme-dark', 'pw-theme-light');
		body.classList.add(`pw-theme-${newTheme}`);

		// Обновляем класс панели
		if (panel) {
			panel.classList.remove('pw-theme-dark', 'pw-theme-light');
			panel.classList.add(`pw-theme-${newTheme}`);
		}

		currentTheme = newTheme;
		localStorage.setItem(STORAGE_THEME, newTheme);

		// Обновляем иконку кнопки
		updateThemeButtonIcon(newTheme);

		// Показываем сообщение
		showSuccessMessage(`Тема изменена на ${newTheme === 'dark' ? 'тёмную' : 'светлую'}`);
	}

	/**
	 * Обновляет иконку кнопки темы
	 */
	function updateThemeButtonIcon(theme) {
		const themeButton = document.querySelector('.pw-panel-theme-button');
		if (!themeButton) return;

		if (theme === 'light') {
			themeButton.innerHTML = '🌙';
			themeButton.title = 'Переключить на тёмную тему';
		} else {
			themeButton.innerHTML = '☀️';
			themeButton.title = 'Переключить на светлую тему';
		}
	}

    // ==========================
    // НОВАЯ ФУНКЦИЯ: Проверка, находимся ли на странице сундука
    // ==========================
    function isChestPage() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('do') && urlParams.get('do') === 'activate' &&
               urlParams.has('cart_id');
    }

    // ==========================
    // НОВЫЙ КОД: Автообработка сундуков в дочерних окнах
    // ==========================
    // Этот код выполняется ТОЛЬКО на страницах сундуков
    if (isChestPage()) {
        console.log('Страница сундука обнаружена...');

        // ПРОВЕРКА: Только для сундуков караванщика, открытых скриптом
        const urlParams = new URLSearchParams(window.location.search);
        const isScriptChest = urlParams.has('script_chest') && urlParams.get('script_chest') === '1';
        const pageText = document.body.innerText || '';
        const isCaravanChest = pageText.includes('Сундук караванщика');

        if (!isCaravanChest || !isScriptChest) {
            console.log('⚠️ Это НЕ сундук караванщика или открыт вручную. Пропускаем обработку.');
            return; // Выходим, не обрабатываем
        }

        console.log('✅ Это сундук караванщика, открытый скриптом. Запускаем автообработку...');

        // Ждем полной загрузки страницы
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', processChestSelf);
        } else {
            setTimeout(processChestSelf, 500);
        }

        function processChestSelf() {
            try {
                console.log('Начинаем автообработку сундука...');

                // 1. Выделяем все чекбоксы
                const checkboxes = document.querySelectorAll('input.promo_all_item_box[name="chest_items[]"]');
                let checkedCount = 0;

                checkboxes.forEach(checkbox => {
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                        checkedCount++;
                    }
                });

                console.log(`Отмечено предметов: ${checkedCount}`);

                if (checkedCount === 0) {
                    console.log('Нет предметов для отметки, закрываем окно через 2 секунды');
                    setTimeout(() => {
                        if (!window.closed) window.close();
                    }, 2000);
                    return;
                }

                // 2. Находим кнопку отправки
                const submitButton = document.querySelector('input.chest_submit_button[type="submit"]');
                if (!submitButton) {
                    console.log('Кнопка отправки не найдена, закрываем окно через 2 секунды');
                    setTimeout(() => {
                        if (!window.closed) window.close();
                    }, 2000);
                    return;
                }

                // 3. Находим форму
                const form = submitButton.closest('form');
                if (!form) {
                    console.log('Форма не найдена, закрываем окно через 2 секунды');
                    setTimeout(() => {
                        if (!window.closed) window.close();
                    }, 2000);
                    return;
                }

                // 4. Отправляем AJAX
                const formData = new FormData(form);

                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        console.log('✅ Награды получены успешно! Закрываем окно через 1 секунду...');
                        // Закрываем окно через 1 секунду
                        setTimeout(() => {
                            if (!window.closed) window.close();
                        }, 1000);
                    } else {
                        console.error('❌ Ошибка при получении наград:', response.status);
                        // Закрываем окно через 3 секунды при ошибке
                        setTimeout(() => {
                            if (!window.closed) window.close();
                        }, 3000);
                    }
                })
                .catch(error => {
                    console.error('❌ Сетевая ошибка:', error);
                    setTimeout(() => {
                        if (!window.closed) window.close();
                    }, 3000);
                });

                // Резервное закрытие через 10 секунд
                setTimeout(() => {
                    if (!window.closed) {
                        console.log('⚠️ Резервное закрытие по таймауту');
                        window.close();
                    }
                }, 10000);

            } catch (error) {
                console.error('❌ Ошибка обработки сундука:', error);
                setTimeout(() => {
                    if (!window.closed) window.close();
                }, 2000);
            }
        }

        // НЕ выполняем остальной код скрипта на страницах сундуков
        return;
    }

    // ==========================
    // ФУНКЦИИ ДЛЯ РАБОТЫ С СУНДУКАМИ КАРАВАНЩИКА
    // ==========================
    /**
     * Загружает настройки задержки из localStorage
     */
    function loadChestDelaySettings() {
        // Тип задержки
        const savedDelayType = localStorage.getItem(STORAGE_CHEST_DELAY_TYPE);
        chestDelayType = savedDelayType || DEFAULT_DELAY_TYPE;

        // Фиксированная задержка
        const savedFixedDelay = localStorage.getItem(STORAGE_CHEST_FIXED_DELAY);
        chestFixedDelay = savedFixedDelay ? parseInt(savedFixedDelay) : DEFAULT_FIXED_DELAY;

        // Случайная задержка - минимальное значение
        const savedRandomMin = localStorage.getItem(STORAGE_CHEST_RANDOM_MIN);
        chestRandomMin = savedRandomMin ? parseInt(savedRandomMin) : DEFAULT_RANDOM_MIN;

        // Случайная задержка - максимальное значение
        const savedRandomMax = localStorage.getItem(STORAGE_CHEST_RANDOM_MAX);
        chestRandomMax = savedRandomMax ? parseInt(savedRandomMax) : DEFAULT_RANDOM_MAX;
    }

    /**
     * Сохраняет настройки задержки в localStorage
     */
    function saveChestDelaySettings() {
        localStorage.setItem(STORAGE_CHEST_DELAY_TYPE, chestDelayType);
        localStorage.setItem(STORAGE_CHEST_FIXED_DELAY, chestFixedDelay.toString());
        localStorage.setItem(STORAGE_CHEST_RANDOM_MIN, chestRandomMin.toString());
        localStorage.setItem(STORAGE_CHEST_RANDOM_MAX, chestRandomMax.toString());
    }

    /**
     * Возвращает задержку на основе текущих настроек
     * @param {number} index Индекс сундука (для случайной задержки)
     * @returns {number} Задержка в миллисекундах
     */
    function getChestDelay(index = 0) {
        switch (chestDelayType) {
            case CHEST_DELAY_TYPES.NONE:
                return 0;

            case CHEST_DELAY_TYPES.FIXED:
                return Math.max(0, chestFixedDelay);

            case CHEST_DELAY_TYPES.RANDOM:
                const min = Math.max(0, chestRandomMin);
                const max = Math.max(min, chestRandomMax);
                return Math.floor(Math.random() * (max - min + 1)) + min;

            default:
                return 0;
        }
    }

    /**
     * Показывает модальное окно настроек задержки
     */
    function showChestDelaySettingsModal() {
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'chest-delay-settings-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Заголовок
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';

        const modalTitle = document.createElement('h3');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = 'Настройки задержки открытия окон сундуков';

        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => modal.remove();

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // Тело модального окна
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body pw-scrollbar';

        // Тип задержки
        const delayTypeContainer = document.createElement('div');
        delayTypeContainer.className = 'delay-type-container';

        const delayTypeTitle = document.createElement('h4');
        delayTypeTitle.className = 'delay-type-title';
        delayTypeTitle.textContent = 'Тип задержки:';

        // Радио-кнопки для выбора типа задержки
        const radioContainer = document.createElement('div');
        radioContainer.className = 'radio-container';

        // Без задержки
        const noDelayContainer = document.createElement('label');
        noDelayContainer.className = 'radio-label';

        const noDelayRadio = document.createElement('input');
        noDelayRadio.type = 'radio';
        noDelayRadio.name = 'delayType';
        noDelayRadio.value = CHEST_DELAY_TYPES.NONE;
        noDelayRadio.checked = chestDelayType === CHEST_DELAY_TYPES.NONE;
        noDelayRadio.className = 'radio-input';

        const noDelayText = document.createElement('span');
        noDelayText.className = 'radio-text';
        noDelayText.textContent = 'Без задержки';

        noDelayContainer.appendChild(noDelayRadio);
        noDelayContainer.appendChild(noDelayText);

        // Фиксированная задержки
        const fixedDelayContainer = document.createElement('label');
        fixedDelayContainer.className = 'radio-label';

        const fixedDelayRadio = document.createElement('input');
        fixedDelayRadio.type = 'radio';
        fixedDelayRadio.name = 'delayType';
        fixedDelayRadio.value = CHEST_DELAY_TYPES.FIXED;
        fixedDelayRadio.checked = chestDelayType === CHEST_DELAY_TYPES.FIXED;
        fixedDelayRadio.className = 'radio-input';

        const fixedDelayText = document.createElement('span');
        fixedDelayText.className = 'radio-text';
        fixedDelayText.textContent = 'Фиксированная задержка:';

        const fixedDelayInput = document.createElement('input');
        fixedDelayInput.type = 'number';
        fixedDelayInput.min = '0';
        fixedDelayInput.max = '5000';
        fixedDelayInput.step = '50';
        fixedDelayInput.value = chestFixedDelay;
        fixedDelayInput.disabled = chestDelayType !== CHEST_DELAY_TYPES.FIXED;
        fixedDelayInput.className = 'delay-input';

        const fixedDelayUnit = document.createElement('span');
        fixedDelayUnit.className = 'delay-unit';
        fixedDelayUnit.textContent = 'мс';

        fixedDelayContainer.appendChild(fixedDelayRadio);
        fixedDelayContainer.appendChild(fixedDelayText);
        fixedDelayContainer.appendChild(fixedDelayInput);
        fixedDelayContainer.appendChild(fixedDelayUnit);

        // Случайная задержка
        const randomDelayContainer = document.createElement('label');
        randomDelayContainer.className = 'radio-label';

        const randomDelayRadio = document.createElement('input');
        randomDelayRadio.type = 'radio';
        randomDelayRadio.name = 'delayType';
        randomDelayRadio.value = CHEST_DELAY_TYPES.RANDOM;
        randomDelayRadio.checked = chestDelayType === CHEST_DELAY_TYPES.RANDOM;
        randomDelayRadio.className = 'radio-input';

        const randomDelayText = document.createElement('span');
        randomDelayText.className = 'radio-text';
        randomDelayText.textContent = 'Случайная в диапазоне:';

        const randomMinInput = document.createElement('input');
        randomMinInput.type = 'number';
        randomMinInput.min = '0';
        randomMinInput.max = '5000';
        randomMinInput.step = '10';
        randomMinInput.value = chestRandomMin;
        randomMinInput.disabled = chestDelayType !== CHEST_DELAY_TYPES.RANDOM;
        randomMinInput.className = 'delay-input';

        const randomDash = document.createElement('span');
        randomDash.className = 'dash';
        randomDash.textContent = '—';

        const randomMaxInput = document.createElement('input');
        randomMaxInput.type = 'number';
        randomMaxInput.min = '0';
        randomMaxInput.max = '5000';
        randomMaxInput.step = '10';
        randomMaxInput.value = chestRandomMax;
        randomMaxInput.disabled = chestDelayType !== CHEST_DELAY_TYPES.RANDOM;
        randomMaxInput.className = 'delay-input';

        const randomDelayUnit = document.createElement('span');
        randomDelayUnit.className = 'delay-unit';
        randomDelayUnit.textContent = 'мс';

        randomDelayContainer.appendChild(randomDelayRadio);
        randomDelayContainer.appendChild(randomDelayText);
        randomDelayContainer.appendChild(randomMinInput);
        randomDelayContainer.appendChild(randomDash);
        randomDelayContainer.appendChild(randomMaxInput);
        randomDelayContainer.appendChild(randomDelayUnit);

        radioContainer.appendChild(noDelayContainer);
        radioContainer.appendChild(fixedDelayContainer);
        radioContainer.appendChild(randomDelayContainer);

        delayTypeContainer.appendChild(delayTypeTitle);
        delayTypeContainer.appendChild(radioContainer);

        // Описание
        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'description-container';

        const descriptionTitle = document.createElement('h4');
        descriptionTitle.className = 'description-title';
        descriptionTitle.textContent = 'Описание типов задержки:';

        const descriptionList = document.createElement('ul');
        descriptionList.className = 'description-list';

        const desc1 = document.createElement('li');
        desc1.innerHTML = '<strong>Без задержки</strong> — окна открываются сразу одно за другим';
        const desc2 = document.createElement('li');
        desc2.innerHTML = '<strong>Фиксированная задержка</strong> — между открытием окон будет постоянная задержка';
        const desc3 = document.createElement('li');
        desc3.innerHTML = '<strong>Случайная задержка</strong> — между открытием окон будет случайная задержка в указанном диапазоне (рекомендуется)';

        descriptionList.appendChild(desc1);
        descriptionList.appendChild(desc2);
        descriptionList.appendChild(desc3);

        descriptionContainer.appendChild(descriptionTitle);
        descriptionContainer.appendChild(descriptionList);

        // Кнопки управления
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'pw-panel-button';
        cancelButton.textContent = 'Отмена';
        cancelButton.onclick = () => modal.remove();

        const saveButton = document.createElement('button');
        saveButton.className = 'pw-panel-button primary';
        saveButton.textContent = 'Сохранить';
        saveButton.onclick = () => {
            // Сохраняем выбранный тип
            const selectedRadio = document.querySelector('input[name="delayType"]:checked');
            if (selectedRadio) {
                chestDelayType = selectedRadio.value;
            }

            // Сохраняем значения
            if (chestDelayType === CHEST_DELAY_TYPES.FIXED) {
                chestFixedDelay = Math.max(0, parseInt(fixedDelayInput.value) || DEFAULT_FIXED_DELAY);
            } else if (chestDelayType === CHEST_DELAY_TYPES.RANDOM) {
                let min = Math.max(0, parseInt(randomMinInput.value) || DEFAULT_RANDOM_MIN);
                let max = Math.max(0, parseInt(randomMaxInput.value) || DEFAULT_RANDOM_MAX);

                // Убеждаемся, что min <= max
                if (min > max) {
                    [min, max] = [max, min];
                }

                chestRandomMin = min;
                chestRandomMax = max;
            }

            saveChestDelaySettings();
            modal.remove();
            showSuccessMessage('Настройки задержки сохранены');
        };

        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(saveButton);

        // Обработчики для радио-кнопки
        noDelayRadio.onchange = () => {
            fixedDelayInput.disabled = true;
            fixedDelayInput.className = 'delay-input';
            randomMinInput.disabled = true;
            randomMaxInput.disabled = true;
            randomMinInput.className = 'delay-input';
            randomMaxInput.className = 'delay-input';
        };

        fixedDelayRadio.onchange = () => {
            fixedDelayInput.disabled = false;
            fixedDelayInput.className = 'delay-input';
            randomMinInput.disabled = true;
            randomMaxInput.disabled = true;
            randomMinInput.className = 'delay-input';
            randomMaxInput.className = 'delay-input';
        };

        randomDelayRadio.onchange = () => {
            fixedDelayInput.disabled = true;
            fixedDelayInput.className = 'delay-input';
            randomMinInput.disabled = false;
            randomMaxInput.disabled = false;
            randomMinInput.className = 'delay-input';
            randomMaxInput.className = 'delay-input';
        };

        // Собираем модальное окно
        modalBody.appendChild(delayTypeContainer);
        modalBody.appendChild(descriptionContainer);

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);
        modal.classList.add('active');

        // Закрытие по клику вне окна
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    /**
     * Ищет все сундуки караванщика на странице
     * @returns {Array} Массив объектов с информацией о сундуках
     */
    function findCaravanChests() {
        const chests = [];
        const chestBlocks = document.querySelectorAll('.chest_input_block');

        chestBlocks.forEach(block => {
            const label = block.querySelector('label');
            if (!label) return;

            // Получаем текст без вложенных span
            const text = Array.from(label.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent.trim())
                .join(' ');

            // Ищем сундук караванщика по названию
            if (text.includes('Сундук караванщика')) {
                const activateLink = block.querySelector('a.chest_activate_red');
                if (activateLink && activateLink.href) {
                    chests.push({
                        block: block,
                        label: label,
                        link: activateLink.href,
                        text: text
                    });
                }
            }
        });

        return chests;
    }

    /**
     * Открывает сундуки караванщика
     */
    function openCaravanChests() {
        // Проверяем, не выполняется ли уже процесс открытия
        if (isProcessingChests) {
            alert('Процесс открытия сундуков уже выполняется!');
            return;
        }

        // Ищем все сундуки караванщика
        chestsToProcess = findCaravanChests();

        if (chestsToProcess.length === 0) {
            alert('Сундуки караванщика не найдены на этой странице.');
            return;
        }

        // Сбрасываем статистику открытия окон
        window.chestOpenStats = {
            failed: 0,
            success: 0,
            errorShown: false
        };

        // Показываем предупреждение
        if (confirm(`Будет открыто ${chestsToProcess.length} дополнительных окон для получения наград.\n\nВажно: Для работы функции необходимо разрешить всплывающие окна в браузере для сайта pwonline.ru \n\nПродолжить?`)) {
            // Сбрасываем массивы
            chestWindows = [];
            isProcessingChests = true;

            // Открываем все сундуки
            chestsToProcess.forEach((chest, index) => {
                setTimeout(() => {
                    openChestWindow(chest, index);
                }, getChestDelay(index)); // Используем настраиваемую задержку
            });

            // Запускаем мониторинг окон
            monitorChestWindows();
        }
    }

    /**
     * Открывает окно сундука
     * @param {Object} chest Объект с информацией о сундуке
     * @param {number} index Индекс сундука
     */
    function openChestWindow(chest, index) {
        // Добавляем параметр для обозначения, что окно открыто скриптом
        const url = new URL(chest.link);
        url.searchParams.set('script_chest', '1');

        // Инициализация счетчиков при первом вызове
        if (!window.chestOpenStats) {
            window.chestOpenStats = {
                failed: 0,
                success: 0,
                errorShown: false
            };
        }

        try {
            // Открываем новое окно с параметром '_blank'
            const win = window.open(url.toString(), `chest_window_${index}`, 'width=800,height=600,resizable=yes,scrollbars=yes', '_blank');

            if (win) {
                chestWindows.push({
                    window: win,
                    url: url.toString(),
                    index: index,
                    processed: false,
                    closed: false,
                    startTime: Date.now()
                });
                console.log(`Открыто окно сундука ${index + 1}: ${chest.text}`);
                window.chestOpenStats.success++;
                window.chestOpenStats.failed = 0; // Сбрасываем счетчик неудач при успехе
            } else {
                console.error(`Не удалось открыть окно сундука ${index + 1}. Возможно, блокировщик всплывающих окон.`);
                window.chestOpenStats.failed++;

                // Показываем сообщение об ошибке после 2 неудачных попыток И если еще не показывали
                if (window.chestOpenStats.failed >= 2 && !window.chestOpenStats.errorShown) {
                    window.chestOpenStats.errorShown = true;
                    showErrorMessage('Не удалось открыть окна сундуков. Разрешите всплывающие окна для этого сайта.');
                }
            }
        } catch (e) {
            console.error(`Ошибка при открытии окна сундука ${index + 1}:`, e);
            window.chestOpenStats.failed++;

            // Показываем сообщение об ошибке после 2 неудачных попыток И если еще не показывали
            if (window.chestOpenStats.failed >= 2 && !window.chestOpenStats.errorShown) {
                window.chestOpenStats.errorShown = true;
                showErrorMessage(`Ошибка при открытии сундуков: ${e.message}`);
            }
        }
    }

    /**
     * Мониторит открытые окна сундуков
     * ИЗМЕНЕНО: Теперь только мониторит, не управляет окнами
     */
    function monitorChestWindows() {
        const checkInterval = setInterval(() => {
            // Проверяем состояние всех окон
            let allClosed = true;

            chestWindows.forEach((chestWin, index) => {
                if (chestWin.closed) return;

                // Проверяем, закрыто ли окно
                if (chestWin.window.closed) {
                    chestWin.closed = true;
                    chestWin.processed = true; // Если окно закрылось, считаем обработанным
                    console.log(`Окно сундука ${index + 1} закрылось само`);
                    return;
                }

                allClosed = false;

                // Если окно еще не обработано, просто проверяем его состояние
                if (!chestWin.processed) {
                    // Проверяем, не истек ли таймаут (10 секунд)
                    const elapsed = Date.now() - chestWin.startTime;
                    if (elapsed > 10000) { // 10 секунд таймаут
                        console.log(`Окно сундука ${index + 1}: превышен таймаут, считаем обработанным`);
                        chestWin.processed = true;
                    }
                }
            });

            // Если все окна закрыты, завершаем процесс
            if (allClosed || chestWindows.every(w => w.closed || w.processed)) {
                clearInterval(checkInterval);
                isProcessingChests = false;

                // Показываем сообщение о завершении
                const processedCount = chestWindows.filter(w => w.processed).length;
                const closedCount = chestWindows.filter(w => w.closed).length;

                showSuccessMessage(`Открытие сундуков завершено!\nОбработано: ${processedCount}\nЗакрыто: ${closedCount}`);

                // Перезагружаем страницу через 3 секунды
                setTimeout(() => {
                    location.reload();
                }, 3000);
            }
        }, 1000);
    }

    /**
     * Обрабатывает окно сундука
     * ИЗМЕНЕНО: Удалено управление закрытием окна
     */
    function processChestWindow(chestWin) {
        // ЭТУ ФУНКЦИЮ БОЛЬШЕ НЕ ИСПОЛЬЗУЕМ
        // Дочерние окна обрабатываются самостоятельно
        console.log(`Мониторинг окна ${chestWin.index + 1}: окно должно само обработаться и закрыться`);
        chestWin.processed = true; // Просто отмечаем как обработанное
    }

    // ==========================
    // LOAD/SAVE GIFT TYPES
    // ==========================
    function loadGiftTypes() {
        const saved = localStorage.getItem(STORAGE_GIFT_TYPES);
        if (saved) {
            try {
                currentGiftTypes = JSON.parse(saved);
                return currentGiftTypes;
            } catch (e) {
                console.error('Ошибка загрузки списка предметов:', e);
                currentGiftTypes = JSON.parse(JSON.stringify(DEFAULT_GIFT_TYPES));
                return currentGiftTypes;
            }
        }
        currentGiftTypes = JSON.parse(JSON.stringify(DEFAULT_GIFT_TYPES));
        return currentGiftTypes;
    }

    function saveGiftTypes() {
        localStorage.setItem(STORAGE_GIFT_TYPES, JSON.stringify(currentGiftTypes));
    }

    function resetGiftTypes() {
        currentGiftTypes = JSON.parse(JSON.stringify(DEFAULT_GIFT_TYPES));
        saveGiftTypes();
        return currentGiftTypes;
    }

    // ==========================
    // WAIT FOR SHARDS
    // ==========================
    function waitForShards() {
        attempts++;
        if (typeof window.shards !== 'undefined') {
            processShards(window.shards);
        } else if (attempts < MAX_ATTEMPTS) {
            setTimeout(waitForShards, DELAY);
        } else {
            console.warn('shards не найден');
        }
    }

    // ==========================
    // PROCESS SHARDS
    // ==========================
    function processShards(newShards) {
        // ИЗМЕНЕНО: Ранняя проверка на страницу сундука
        if (isChestPage()) {
            console.log('Страница сундука - не обрабатываем shards');
            return;
        }

        const newStr = JSON.stringify(newShards);
        const savedStr = localStorage.getItem(STORAGE_SHARDS);

        const isNew = !savedStr || savedStr !== newStr;
        if (isNew) localStorage.setItem(STORAGE_SHARDS, newStr);

        buildSelect(isNew ? newShards : JSON.parse(savedStr));

        // Автоустановка
        if (autoCheckbox && autoCheckbox.checked) setTimeout(applySelected, 150);
    }

    // ==========================
    // BUILD CHARACTER MODEL
    // ==========================
    function buildModel(shardsObj) {
        const list = [];
        for (const shardKey in shardsObj) {
            const shard = shardsObj[shardKey];
            const shardValue = String(shardKey);

            for (const accKey in shard.accounts) {
                const acc = shard.accounts[accKey];
                acc.chars.forEach(char => {
                    const charValue = `${acc.id}_${shardValue}_${char.id}`;
                    list.push({
                        shardValue,
                        charValue,
                        text: `${shard.name} → ${acc.name} → ${char.name} (${char.occupation}, ${char.level})`
                    });
                });
            }
        }
        return list;
    }

    // ==========================
    // BUILD SELECT
    // ==========================
    function buildSelect(shardsObj) {
        const model = buildModel(shardsObj);
        panelSelect.innerHTML = '';

        model.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.charValue;
            opt.dataset.shard = item.shardValue;
            opt.textContent = item.text;
            panelSelect.appendChild(opt);
        });

        restoreSelection();
    }

    function saveSelection() {
        const opt = panelSelect.options[panelSelect.selectedIndex];
        if (!opt) return;
        localStorage.setItem(STORAGE_SELECTED, JSON.stringify({
            charValue: opt.value,
            shardValue: opt.dataset.shard
        }));
    }

    function restoreSelection() {
        const raw = localStorage.getItem(STORAGE_SELECTED);
        if (!raw) return;
        const saved = JSON.parse(raw);
        const found = [...panelSelect.options].find(o =>
            o.value === saved.charValue && o.dataset.shard === saved.shardValue
        );
        if (found) panelSelect.value = saved.charValue;
    }

    // ==========================
    // APPLY SELECTED CHARACTER
    // ==========================
    function applySelected() {
        const opt = panelSelect.options[panelSelect.selectedIndex];
        if (!opt) return;

        const shardValue = opt.dataset.shard;
        const charValue = opt.value;

        const shardSelect = document.querySelector('.js-shard');
        const charSelect = document.querySelector('.js-char');

        if (!shardSelect || !charSelect) {
            alert('Не найдены селекты страницы');
            return;
        }

        shardSelect.value = shardValue;
        (window.jQuery ? window.jQuery(shardSelect).trigger('change') :
            shardSelect.dispatchEvent(new Event('change', { bubbles: true })));

        const start = Date.now();
        const timer = setInterval(() => {
            const exists = [...charSelect.options].find(o => o.value === charValue);
            if (exists) {
                charSelect.value = charValue;
                (window.jQuery ? window.jQuery(charSelect).trigger('change') :
                    charSelect.dispatchEvent(new Event('change', { bubbles: true })));
                clearInterval(timer);
            }
            if (Date.now() - start > 5000) {
                clearInterval(timer);
                alert('Персонаж не появился');
            }
        }, 200);
    }

    // ==========================
    // GIFT SELECTION
    // ==========================
    function selectGiftItems() {
        const selectedType = giftSelect.value;

        // Проверяем, выбран ли пункт "Выделять всё"
        if (selectedType === 'select_all') {
            selectAllMatchingItems();
            return;
        }

        // Проверяем, выбран ли пункт "Передать всё"
        if (selectedType === 'all') {
            if (!confirm('⚠️ ВНИМАНИЕ!\n\nВы выбрали опцию "Передать всё". Это приведет к выделению ВСЕХ предметов на странице.\nВыделение более чем 6 предметов не рекомендуется.\nДля передачи большого количества подарков рекомендуется использовать последовательную передачу.\n\nВы уверены, что хотите продолжить?')) {
                return;
            }
            selectAllItems();
            return;
        }

        const types = currentGiftTypes.length > 0 ? currentGiftTypes : DEFAULT_GIFT_TYPES;
        const type = types.find(g => g.name === selectedType);
        if (!type) return;

        const blocks = document.querySelectorAll('.item_input_block');
        let count = 0;

        blocks.forEach(block => {
            if (count >= MAX_ITEMS_PER_BATCH) return;

            const label = block.querySelector('label');
            const checkbox = block.querySelector('input[type="checkbox"]');
            if (!label || !checkbox) return;

            // Получаем только текст без вложенных span
            const text = Array.from(label.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent.trim())
                .join(' ');

            const matched = type.targets.some(t => text.includes(t));
            if (!matched) return;

            if (!checkbox.checked) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
            count++;
        });

        alert(`Отмечено чекбоксов: ${count}`);
    }

    // ==========================
    // ВЫДЕЛИТЬ ВСЕ ПОДХОДЯЩИЕ ПРЕДМЕТЫ (первые 5)
    // ==========================
    function selectAllMatchingItems() {
        const blocks = document.querySelectorAll('.item_input_block');
        let count = 0;

        // Сначала снимаем все выделения
        clearAllCheckboxes();

        // Отмечаем первые 5 предметов
        blocks.forEach(block => {
            if (count >= MAX_ITEMS_PER_BATCH) return;

            const checkbox = block.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                count++;
            }
        });

        alert(`Выделено первых ${count} предметов (максимум ${MAX_ITEMS_PER_BATCH})`);
    }

    // ==========================
    // ВЫБРАТЬ ВСЕ ПРЕДМЕТЫ ВЫБРАННОЙ КАТЕГОРИИ
    // ==========================
    function selectAllCategoryItems() {
        const selectedType = giftSelect.value;

        // Проверяем, не выбраны ли специальные пункты
        if (selectedType === 'select_all') {
            if (!confirm('Внимание, это приведет к выделению всех предметов.\nВыделение более чем 6 предметов не рекомендуется.\nДля передачи большого количества подарков рекомендуется использовать последовательную передачу.\n\nВы уверены, что хотите продолжить?')) {
                return;
            }

            selectAllItems();
            return;
        }

        if (selectedType === 'all') {
            selectGiftItems();
            return;
        }

        const types = currentGiftTypes.length > 0 ? currentGiftTypes : DEFAULT_GIFT_TYPES;
        const type = types.find(g => g.name === selectedType);
        if (!type) {
            alert('Категория не найдена');
            return;
        }

        const blocks = document.querySelectorAll('.item_input_block');
        let count = 0;

        // Сначала снимаем все выделения
        clearAllCheckboxes();

        blocks.forEach(block => {
            const label = block.querySelector('label');
            const checkbox = block.querySelector('input[type="checkbox"]');
            if (!label || !checkbox) return;

            // Получаем только текст без вложенных span
            const text = Array.from(label.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent.trim())
                .join(' ');

            const matched = type.targets.some(t => text.includes(t));
            if (!matched) return;

            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            count++;
        });

        if (!confirm(`Вы собираетесь выделить ${count} предметов категории "${selectedType}".\nВыделение более чем 6 предметов не рекомендуется.\nДля передачи большого количества подарков рекомендуется использовать последовательную передачу.\n\nПродолжить?`)) {
            // Если пользователь передумал, снимаем все выделения
            clearAllCheckboxes();
            return;
        }

        alert(`Выделено ВСЕХ чекбоксов категории "${selectedType}": ${count}\n\nПроверьте выделенные предметы перед передачей!`);
    }

    // ==========================
    // ВЫБРАТЬ ВСЕ ПРЕДМЕТЫ
    // ==========================
    function selectAllItems() {
        const blocks = document.querySelectorAll('.item_input_block');
        let count = 0;

        // Сначала снимаем все выделения
        clearAllCheckboxes();

        // Отмечаем все предметы
        blocks.forEach(block => {
            const checkbox = block.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                count++;
            }
        });

        alert(`Отмечено ВСЕХ чекбоксов: ${count}\n\n⚠️ Проверьте выделенные предметы перед передачей!`);
    }

    // ==========================
    // НАХОЖДЕНИЕ ВСЕХ ПОДХОДЯЩИХ ПРЕДМЕТОВ
    // ==========================
    function findAllMatchingItems() {
        const selectedType = giftSelect.value;

        // Если выбран "Выделять всё", возвращаем все предметы
        if (selectedType === 'select_all') {
            const allItems = [];
            const blocks = document.querySelectorAll('.item_input_block');

            blocks.forEach(block => {
                const label = block.querySelector('label');
                const checkbox = block.querySelector('input[type="checkbox"]');
                if (!label || !checkbox) return;

                // Получаем только текст без вложенных span
                const text = Array.from(label.childNodes)
                    .filter(n => n.nodeType === Node.TEXT_NODE)
                    .map(n => n.textContent.trim())
                    .join(' ');

                allItems.push({
                    block: block,
                    checkbox: checkbox,
                    labelText: text
                });
            });

            return allItems;
        }

        // Если выбран "Передать всё", возвращаем все предметы
        if (selectedType === 'all') {
            const allItems = [];
            const blocks = document.querySelectorAll('.item_input_block');

            blocks.forEach(block => {
                const label = block.querySelector('label');
                const checkbox = block.querySelector('input[type="checkbox"]');
                if (!label || !checkbox) return;

                // Получаем только текст без вложенных span
                const text = Array.from(label.childNodes)
                    .filter(n => n.nodeType === Node.TEXT_NODE)
                    .map(n => n.textContent.trim())
                    .join(' ');

                allItems.push({
                    block: block,
                    checkbox: checkbox,
                    labelText: text
                });
            });

            return allItems;
        }

        const types = currentGiftTypes.length > 0 ? currentGiftTypes : DEFAULT_GIFT_TYPES;
        const type = types.find(g => g.name === selectedType);
        if (!type) return [];

        const matchingItems = [];
        const blocks = document.querySelectorAll('.item_input_block');

        blocks.forEach(block => {
            const label = block.querySelector('label');
            const checkbox = block.querySelector('input[type="checkbox"]');
            if (!label || !checkbox) return;

            // Получаем только текст без вложенных span
            const text = Array.from(label.childNodes)
                .filter(n => n.nodeType === Node.TEXT_NODE)
                .map(n => n.textContent.trim())
                .join(' ');

            const matched = type.targets.some(t => text.includes(t));
            if (matched) {
                matchingItems.push({
                    block: block,
                    checkbox: checkbox,
                    labelText: text
                });
            }
        });

        return matchingItems;
    }

    // ==========================
    // СНЯТЬ ВСЕ ВЫДЕЛЕНИЯ С ЧЕКБОКСОВ
    // ==========================
    function clearAllCheckboxes() {
        document.querySelectorAll('.item_input_block input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    // ==========================
    // РАЗДЕЛЕНИЕ НА ГРУППЫ (по 5 предметов)
    // ==========================
    function createItemGroups(items, limitTotalItems = false) {
        const groups = [];

        // Если ограничено общее количество, берем только первые N предметов
        const itemsToProcess = limitTotalItems ? items.slice(0, maxTotalItems) : items;

        for (let i = 0; i < itemsToProcess.length; i += MAX_ITEMS_PER_BATCH) {
            groups.push(itemsToProcess.slice(i, i + MAX_ITEMS_PER_BATCH));
        }
        return groups;
    }

    // ==========================
    // ВЫДЕЛЕНИЕ ГРУППЫ ПРЕДМЕТОВ
    // ==========================
    function selectItemGroup(group) {
        // Сначала снимаем все чекбоксы
        clearAllCheckboxes();

        // Выделяем чекбоксы текущей группы
        group.forEach(item => {
            if (!item.checkbox.checked) {
                item.checkbox.checked = true;
                item.checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    // ==========================
    // ПОСЛЕДОВАТЕЛЬНАЯ AJAX-ПЕРЕДАЧА
    // ==========================
    let hasWarningInSequential = false;
    let warningMessages = [];

    function sequentialAjaxTransfer() {
        if (isSequentialTransferActive) {
            alert('Последовательная передача уже выполняется!');
            return;
        }
        // Сбрасываем флаги предупреждений
        hasWarningInSequential = false;
        warningMessages = [];

        // Получаем текущее значение максимального общего количества предметов
        updateMaxTotalItemsFromInput();

        // Находим все подходящие предметы
        const allItems = findAllMatchingItems();

        if (allItems.length === 0) {
            alert('Не найдено подходящих предметов для передачи');
            return;
        }

        // Если выбрано "Выделять всё", предупреждаем
        if (giftSelect.value === 'select_all') {
            const totalItems = allItems.length;
            if (!confirm(`Вы выбрали "Выделять всё". Будет передано ${totalItems} предметов.\n\nНачать передачу?`)) {
                return;
            }
        }

        // Если выбрано "Передать всё", спрашиваем подтверждение
        if (giftSelect.value === 'all') {
            const totalItems = allItems.length;
            if (!confirm(`⚠️ ВНИМАНИЕ!\n\nВы выбрали "Передать всё". Будет передано ${totalItems} предметов.\n\nЭто может занять много времени и передать ВСЕ предметы, включая дорогие.\n\nВы уверены, что хотите продолжить?`)) {
                return;
            }
        }

        // Ограничиваем общее количество предметов
        const limitedItems = allItems.slice(0, maxTotalItems);

        if (limitedItems.length === 0) {
            alert(`Ограничение в ${maxTotalItems} предметов слишком строгое, нет предметов для передачи`);
            return;
        }

        // Создаем группы по 5 предметов
        allItemGroups = createItemGroups(limitedItems, true);
        totalGroups = allItemGroups.length;
        currentGroupIndex = 0;

        if (totalGroups === 0) {
            alert('Не удалось создать группы предметов');
            return;
        }

        // Рассчитываем общее количество предметов для передачи
        let totalItemsToTransfer = 0;
        allItemGroups.forEach(group => {
            totalItemsToTransfer += group.length;
        });

        // Показываем информацию о передаче
        const totalFound = allItems.length;
        const willTransfer = totalItemsToTransfer;
        const skipped = totalFound > maxTotalItems ? totalFound - maxTotalItems : 0;

        let message = `Найдено ${totalFound} предметов.\n`;
        message += `Будет передано: ${willTransfer} предметов (ограничение: ${maxTotalItems}).\n`;
        message += `Пропущено: ${skipped} предметов.\n`;
        message += `Разделено на ${totalGroups} групп по ${MAX_ITEMS_PER_BATCH} предметов.`;

        if (giftSelect.value === 'select_all') {
            message = `ВЫДЕЛИТЬ ВСЁ: ${totalFound} предметов\n` + message;
        } else if (giftSelect.value === 'all') {
            message = `⚠️ ПЕРЕДАТЬ ВСЁ: ${totalFound} предметов\n` + message;
        }

        if (!confirm(message + "\n\nНачать передачу?")) {
            return;
        }

        // Запускаем процесс передачи
        isSequentialTransferActive = true;
        processNextGroup();
    }

    // ==========================
    // ОБНОВЛЕНИЕ МАКСИМАЛЬНОГО ОБЩЕГО КОЛИЧЕСТВА ПРЕДМЕТОВ
    // ==========================
    function updateMaxTotalItemsFromInput() {
        const value = parseInt(maxTotalItemsInput.value);
        if (!isNaN(value) && value > 0 && value <= 100) {
            maxTotalItems = value;
            localStorage.setItem(STORAGE_SEQUENTIAL_MAX_TOTAL_ITEMS, value.toString());
        } else {
            // Если значение некорректно, используем значение по умолчанию
            maxTotalItems = DEFAULT_MAX_TOTAL_ITEMS;
            maxTotalItemsInput.value = DEFAULT_MAX_TOTAL_ITEMS;
        }
    }

    // ==========================
    // ОБРАБОТКА СЛЕДУЮЩЕЙ ГРУППЫ
    // ==========================
    function processNextGroup() {
        if (currentGroupIndex >= totalGroups) {
            // Все группы обработаны
            isSequentialTransferActive = false;

            // Рассчитываем общее количество переданных предметов
            let totalTransferred = 0;
            allItemGroups.forEach(group => {
                totalTransferred += group.length;
            });

            const totalFound = findAllMatchingItems().length;
            const skipped = totalFound > maxTotalItems ? totalFound - maxTotalItems : 0;

            let successMessage = '';

            // Формируем сообщение с учетом предупреждений
            if (hasWarningInSequential) {
                successMessage = `⚠️ Последовательная передача завершена с предупреждениями!\n\n`;
                successMessage += `Передано: ${totalTransferred} предметов.\n`;
                successMessage += `Ограничение: ${maxTotalItems} предметов.\n`;
                if (skipped > 0) {
                    successMessage += `Пропущено: ${skipped} предметов.\n`;
                }
                successMessage += `\nПредупреждения:\n${warningMessages.join('\n')}\n\n`;
                successMessage += `Проверьте условия (время/уровень) для непереданных подарков.`;

                showWarningMessage(successMessage, 8000);
            } else {
                successMessage = `🎁 Последовательная передача завершена!\n`;
                successMessage += `Передано: ${totalTransferred} предметов.\n`;
                successMessage += `Ограничение: ${maxTotalItems} предметов.\n`;
                if (skipped > 0) {
                    successMessage += `Пропущено: ${skipped} предметов.`;
                }

                if (giftSelect.value === 'select_all') {
                    successMessage = `🎁 Все подходящие предметы переданы!\n` + successMessage;
                } else if (giftSelect.value === 'all') {
                    successMessage = `🎁 ВСЕ предметы переданы!\n` + successMessage;
                }

                showSuccessMessage(successMessage);
            }

            // Сбрасываем флаги предупреждений для следующей передачи
            hasWarningInSequential = false;
            warningMessages = [];

            // Если установлен флаг перезагрузки, перезагружаем страницу
            if (shouldReloadAfterSequential) {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
            return;
        }

        const currentGroup = allItemGroups[currentGroupIndex];

        // Показываем прогресс
        showLoadingIndicator(`Передача группы ${currentGroupIndex + 1} из ${totalGroups} (${currentGroup.length} предметов из ${maxTotalItems})...`);

        // Выделяем текущую группу
        selectItemGroup(currentGroup);

        // Ждем немного перед отправкой
        setTimeout(() => {
            // Выполняем AJAX-передачу для текущей группы
            performGroupTransfer(currentGroupIndex);
        }, 500);
    }

    // ==========================
    // ВЫПОЛНЕНИЕ ПЕРЕДАЧИ ДЛЯ ГРУППЫ
    // ==========================
    function performGroupTransfer(groupIndex) {
        const originalBtn = document.querySelector('.go_items.js-transfer-go');
        if (!originalBtn) {
            hideLoadingIndicator();
            alert('Кнопка передачи не найдена');
            isSequentialTransferActive = false;
            return;
        }

        const form = originalBtn.closest('form');
        if (!form) {
            hideLoadingIndicator();
            alert('Форма не найдена');
            isSequentialTransferActive = false;
            return;
        }

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            redirect: 'manual',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        })
            .then(response => response.arrayBuffer()) // Получаем как ArrayBuffer
            .then(buffer  => {
            hideLoadingIndicator();
            // Декодируем с учетом кодировки из XML
            const responseText = decodeResponse(buffer);

            hideLoadingIndicator();

            console.log('Ответ от сервера (декодирован):', responseText);

            // Проверяем наличие предупреждений/ошибок
            const hasWarning = hasWarningInResponse(responseText);
            const warningMessage = extractWarningMessage(responseText);

            // Если было предупреждение, запоминаем это для финального сообщения
            if (hasWarning) {
                hasWarningInSequential = true;
                if (warningMessage) {
                    warningMessages.push(`Группа ${groupIndex + 1}: ${warningMessage}`);
                } else {
                    warningMessages.push(`Группа ${groupIndex + 1}: получено предупреждение`);
                }
            }

            // Успешная передача группы (независимо от предупреждений)
            currentGroupIndex++;

            // Показываем промежуточный успех с учетом предупреждений
            if (currentGroupIndex < totalGroups) {
                // Рассчитываем сколько уже передано
                let transferredSoFar = 0;
                for (let i = 0; i < currentGroupIndex; i++) {
                    transferredSoFar += allItemGroups[i].length;
                }

                let message = `✓ Группа ${groupIndex + 1} передана. Передано уже: ${transferredSoFar}/${maxTotalItems}.`;

                if (hasWarning) {
                    if (warningMessage) {
                        message = `⚠️ Группа ${groupIndex + 1} передана с предупреждением!\n${warningMessage}\n\n` + message;
                    } else {
                        message = `⚠️ Группа ${groupIndex + 1} передана с предупреждением!\nНекоторые подарки не были переданы. Проверьте условия (время/уровень).\n\n` + message;
                    }
                    showWarningMessage(message, 3000);
                } else {
                    showSuccessMessage(message, 1500);
                }

                // Ждем перед обработкой следующей группы
                setTimeout(() => {
                    processNextGroup();
                }, 1000);
            } else {
                // Последняя группа передана
                processNextGroup(); // Вызовет завершение
            }
        })
            .catch(error => {
            hideLoadingIndicator();
            console.error('Ошибка сети:', error);
            showErrorMessage(`Сетевая ошибка при передаче группы ${groupIndex + 1}`);
            isSequentialTransferActive = false;
        });
    }

    // ==========================
    // TRANSFER (Оригинальная кнопка)
    // ==========================
    function transferItems() {
        // Если выбрано "Выделять всё", обычное подтверждение
        if (giftSelect.value === 'select_all') {
            const checkedItems = document.querySelectorAll('.item_input_block input[type="checkbox"]:checked');
            if (checkedItems.length === 0) {
                alert('Не выбрано ни одного предмета для передачи');
                return;
            }

            if (!confirm(`Вы собираетесь передать ${checkedItems.length} предметов.\n\nНачать передачу?`)) {
                return;
            }
        }

        // Если выбрано "Передать всё", спрашиваем подтверждение
        if (giftSelect.value === 'all') {
            const checkedItems = document.querySelectorAll('.item_input_block input[type="checkbox"]:checked');
            if (checkedItems.length === 0) {
                alert('Не выбрано ни одного предмета для передачи');
                return;
            }

            if (!confirm(`⚠️ ВНИМАНИЕ!\n\nВы собираетесь передать ${checkedItems.length} предметов.\n\nПроверьте, что выбраны только нужные предметы.\n\nВы уверены, что хотите продолжить?`)) {
                return;
            }
        }

        const btn = document.querySelector('.go_items.js-transfer-go');
        if (!btn) return alert('Кнопка передачи не найдена');
        window.jQuery ? window.jQuery(btn).click() : btn.click();
    }

    // ==========================
    // AJAX TRANSFER (Новая функция без перезагрузки)
    // ==========================
    function ajaxTransferItems(reloadAfterSuccess = false) {
        const originalBtn = document.querySelector('.go_items.js-transfer-go');
        if (!originalBtn) {
            alert('Кнопка передачи не найдена');
            return;
        }

        // Находим форму
        const form = originalBtn.closest('form');
        if (!form) {
            // Если кнопка не в форме, используем стандартный клик
            alert('Форма не найдена, используем стандартную передачу');
            return transferItems();
        }

        // Проверяем, выбраны ли предметы
        const checkedItems = document.querySelectorAll('.item_input_block input[type="checkbox"]:checked');
        if (checkedItems.length === 0) {
            alert('Не выбрано ни одного предмета для передачи');
            return;
        }

        // Если выбрано "Выделять всё", обычное подтверждение
        if (giftSelect.value === 'select_all') {
            if (!confirm(`AJAX передача ${checkedItems.length} предметов.\n\nНачать передачу?`)) {
                return;
            }
        }

        // Если выбрано "Передать всё", спрашиваем подтверждение
        if (giftSelect.value === 'all') {
            if (!confirm(`⚠️ ВНИМАНИЕ!\n\nAJAX передача ${checkedItems.length} предметов.\n\nПроверьте, что выбраны только нужные предметы.\n\nВы уверены, что хотите продолжить?`)) {
                return;
            }
        }

        // Устанавливаем флаг перезагрузки (если передано true)
        shouldReloadAfterAjaxTransfer = reloadAfterSuccess;

        // Показываем индикатор загрузки
        showLoadingIndicator('Передача подарков...');

        // Собираем данные формы
        const formData = new FormData(form);

        // Отправляем запрос, но игнорируем редирект
        fetch(form.action, {
            method: 'POST',
            body: formData,
            redirect: 'manual',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        })
            .then(response => response.arrayBuffer()) // Получаем как ArrayBuffer
            .then(buffer  => {
            hideLoadingIndicator();
            // Декодируем с учетом кодировки из XML
            const responseText = decodeResponse(buffer);

            hideLoadingIndicator();

            console.log('Ответ от сервера (декодирован):', responseText);

            // Проверяем наличие предупреждений/ошибок
            const hasWarning = hasWarningInResponse(responseText);
            const warningMessage = extractWarningMessage(responseText);
            // Формируем сообщение
            let message = '🎁 Подарки успешно переданы!';

            if (hasWarning) {
                if (warningMessage) {
                    message = `⚠️ Подарки переданы с предупреждением!\n${warningMessage}\n\nНекоторые подарки не были переданы. Проверьте условия (время/уровень).`;
                } else {
                    message = '⚠️ Подарки переданы с предупреждением!\nНекоторые подарки не были переданы. Проверьте условия (время/уровень).';
                }
            } else if (giftSelect.value === 'select_all') {
                message = '🎁 Все подходящие предметы успешно переданы!';
            } else if (giftSelect.value === 'all') {
                message = '🎁 ВСЕ предметы успешно переданы!';
            }

            if (shouldReloadAfterAjaxTransfer) {
                message += ' Перезагружаем страницу...';
            }

            // Показываем сообщение
            if (hasWarning) {
                showWarningMessage(message);
            } else {
                showSuccessMessage(message);
            }

            clearSelectedItems();

            // Если установлен флаг перезагрузки, перезагружаем страницу через 2 секунды ВСЕГДА
            if (shouldReloadAfterAjaxTransfer) {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        })
            .catch(error => {
            hideLoadingIndicator();
            console.error('Ошибка сети:', error);
            showErrorMessage('Сетевая ошибка. Попробуйте стандартную передачу.');
        });
    }

    // ==========================
    // AJAX TRANSFER С ПЕРЕЗАГРУЗКОЙ (отдельная функция для кнопки с перезагрузкой)
    // ==========================
    function ajaxTransferWithReload() {
        // Вызываем основную функцию с флагом перезагрузки
        ajaxTransferItems(true);
    }

    // ==========================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // ==========================
    function showLoadingIndicator(text) {
        // Удаляем старый индикатор если есть
        hideLoadingIndicator();

        const loader = document.createElement('div');
        loader.className = 'pw-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <div>${text}</div>
        `;
        document.body.appendChild(loader);
    }

    function hideLoadingIndicator() {
        const loader = document.querySelector('.pw-loader');
        if (loader) loader.remove();
    }

    function showSuccessMessage(message, duration = 3000) {
        // Удаляем старое сообщение если есть
        const oldMsg = document.getElementById('ajax-success-message');
        if (oldMsg) oldMsg.remove();

        const successMsg = document.createElement('div');
        successMsg.id = 'ajax-success-message';
        successMsg.className = 'pw-message success';
        successMsg.innerHTML = `
            <div class="pw-message-icon">✓</div>
            <div class="pw-message-content">${message}</div>
        `;
        document.body.appendChild(successMsg);

        // Автоматическое скрытие
        const hideDelay = duration;
        setTimeout(() => {
            successMsg.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                if (successMsg.parentNode) {
                    successMsg.remove();
                }
            }, 500);
        }, hideDelay);
    }

    function showErrorMessage(message) {
        // Удаляем старое сообщение если есть
        const oldMsg = document.getElementById('ajax-error-message');
        if (oldMsg) oldMsg.remove();

        const errorMsg = document.createElement('div');
        errorMsg.id = 'ajax-error-message';
        errorMsg.className = 'pw-message error';
        errorMsg.innerHTML = `
            <div class="pw-message-icon">✗</div>
            <div class="pw-message-content">${message}</div>
        `;
        document.body.appendChild(errorMsg);

        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            errorMsg.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                if (errorMsg.parentNode) {
                    errorMsg.remove();
                }
            }, 500);
        }, 5000);
    }

    function clearSelectedItems() {
        // Снимаем отметки со всех выбранных чекбоксов
        document.querySelectorAll('.item_input_block input[type="checkbox"]:checked').forEach(checkbox => {
            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    // ==========================
    // ПРОВЕРКА НАЛИЧИЯ ПРЕДУПРЕЖДЕНИЙ В ОТВЕТЕ
    // ==========================
    function hasWarningInResponse(responseText) {
        // Проверяем наличие заголовка "Предупреждение" в HTML
        if (responseText.includes('<h2>Предупреждение</h2>')) {
            return true;
        }

        // Проверяем XML ответ с ошибкой (ищем тег error в любом виде)
        if (responseText.includes('<error>')) {
            return true;
        }

        // Проверяем текст о недоступности перевода
        if (responseText.includes('перевод предметов станет доступен после')) {
            return true;
        }

        return false;
    }

    // ==========================
    // ИЗВЛЕЧЕНИЕ ТЕКСТА ПРЕДУПРЕЖДЕНИЯ ИЗ XML
    // ==========================
    function extractWarningMessage(responseText) {
        // Проверяем, есть ли XML декларация с windows-1251
        const isWindows1251 = responseText.includes('encoding="windows-1251"') ||
              responseText.includes("encoding='windows-1251'");

        // Пытаемся извлечь текст из XML
        const xmlMatch = responseText.match(/<error>([\s\S]*?)<\/error>/);
        if (xmlMatch) {
            let message = xmlMatch[1].trim();

            // Если это windows-1251 и мы видим битые символы, пробуем перекодировать
            if (isWindows1251 && /[�]/g.test(message)) {
                // Создаем временный DOM элемент для перекодировки
                const textarea = document.createElement('textarea');
                textarea.innerHTML = message;
                message = textarea.value;
            }

            return message;
        }

        // Пытаемся извлечь текст из HTML предупреждения
        const htmlMatch = responseText.match(/<h2>Предупреждение<\/h2>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/);
        if (htmlMatch) {
            return htmlMatch[1].trim();
        }

        return null;
    }

    // ==========================
    // ДЕКОДИРОВАНИЕ ОТВЕТА С УЧЕТОМ КОДИРОВКИ ИЗ XML
    // ==========================
    function decodeResponse(buffer) {
        // Пробуем определить кодировку из XML декларации
        // Сначала пробуем декодировать как UTF-8, чтобы прочитать заголовок
        let text = new TextDecoder('utf-8').decode(buffer.slice(0, 200));

        // Ищем encoding в XML декларации
        const encodingMatch = text.match(/<\?xml[^>]*encoding=["']([^"']+)["']/i);
        let encoding = encodingMatch ? encodingMatch[1].toLowerCase() : 'utf-8';

        // Нормализуем названия кодировок
        if (encoding === 'windows-1251') {
            encoding = 'windows-1251';
        } else if (encoding === 'utf-8' || encoding === 'utf8') {
            encoding = 'utf-8';
        }

        try {
            // Декодируем весь буфер с правильной кодировкой
            return new TextDecoder(encoding).decode(buffer);
        } catch (e) {
            console.warn('Не удалось декодировать как', encoding, 'пробуем windows-1251');
            try {
                // Пробуем windows-1251 как запасной вариант
                return new TextDecoder('windows-1251').decode(buffer);
            } catch (e2) {
                // Если ничего не работает, возвращаем как есть
                return new TextDecoder().decode(buffer);
            }
        }
    }

    // ==========================
    // СОХРАНЕНИЕ И ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ ПАНЕЛИ
    // ==========================
    function savePanelState(hidden) {
        localStorage.setItem(STORAGE_PANEL_HIDDEN, hidden ? '1' : '0');
    }

    function loadPanelState() {
        const saved = localStorage.getItem(STORAGE_PANEL_HIDDEN);
        return saved === '1';
    }

    // ==========================
    // ПОКАЗ ПРЕДУПРЕЖДАЮЩЕГО СООБЩЕНИЯ
    // ==========================
    function showWarningMessage(message, duration = 5000) {
        // Удаляем старое сообщение если есть
        const oldMsg = document.getElementById('ajax-warning-message');
        if (oldMsg) oldMsg.remove();

        const warningMsg = document.createElement('div');
        warningMsg.id = 'ajax-warning-message';
        warningMsg.className = 'pw-message warning';
        warningMsg.innerHTML = `
        <div class="pw-message-icon">⚠️</div>
        <div class="pw-message-content">${message}</div>
    `;
        document.body.appendChild(warningMsg);

        // Автоматическое скрытие
        setTimeout(() => {
            warningMsg.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                if (warningMsg.parentNode) {
                    warningMsg.remove();
                }
            }, 500);
        }, duration);
    }

    // ==========================
    // МОДАЛЬНОЕ ОКНО ДЛЯ УПРАВЛЕНИЯ ГРУППАМИ
    // ==========================
    function createGiftTypesModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'gift-types-modal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        // Заголовок модального окна
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';

        const modalTitle = document.createElement('h3');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = 'Управление группами предметов';

        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = () => modal.classList.remove('active');

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);

        // Панель управления (кнопки)
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';

        const addGroupBtn = document.createElement('button');
        addGroupBtn.className = 'pw-panel-button primary';
        addGroupBtn.textContent = 'Добавить';
        addGroupBtn.onclick = () => addNewGroup();

        const saveBtn = document.createElement('button');
        saveBtn.className = 'pw-panel-button success';
        saveBtn.textContent = 'Сохранить';
        saveBtn.onclick = () => {
            saveCurrentGiftTypes();
            modal.classList.remove('active');
        };

        const resetBtn = document.createElement('button');
        resetBtn.className = 'pw-panel-button danger';
        resetBtn.textContent = 'Сброс';
        resetBtn.onclick = () => {
            if (confirm('Вы уверены, что хотите сбросить все изменения к значениям по умолчанию?')) {
                resetGiftTypes();
                renderGroupsInModal(document.getElementById('gift-groups-container'));
                updateGiftSelect();
            }
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'pw-panel-button';
        cancelBtn.textContent = 'Отмена';
        cancelBtn.onclick = () => modal.classList.remove('active');

        // Кнопка справки
        const helpBtn = document.createElement('button');
        helpBtn.className = 'pw-panel-icon-button';
        helpBtn.innerHTML = '❓';
        helpBtn.title = 'Справка по добавлению предметов';
        helpBtn.onclick = showGroupHelpModal;

        modalFooter.appendChild(addGroupBtn);
        modalFooter.appendChild(saveBtn);
        modalFooter.appendChild(resetBtn);
        modalFooter.appendChild(cancelBtn);
        modalFooter.appendChild(helpBtn);

        // Основной контейнер для групп
        const groupsContainer = document.createElement('div');
        groupsContainer.id = 'gift-groups-container';
        groupsContainer.className = 'modal-body pw-scrollbar';

        // Собираем модальное окно
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(groupsContainer);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);

        document.body.appendChild(modal);
        return { modal, groupsContainer };
    }

    // ==========================
    // МОДАЛЬНОЕ ОКНО СПРАВКИ ДЛЯ УПРАВЛЕНИЯ ГРУППАМИ
    // ==========================
    function showGroupHelpModal() {
        const helpModal = document.createElement('div');
        helpModal.className = 'modal-overlay';
        helpModal.id = 'group-help-modal';

        const helpContent = document.createElement('div');
        helpContent.className = 'modal-content';

        const helpHeader = document.createElement('div');
        helpHeader.className = 'modal-header';

        const helpTitle = document.createElement('h3');
        helpTitle.className = 'modal-title';
        helpTitle.textContent = 'Справка по добавлению предметов';

        const closeHelpButton = document.createElement('button');
        closeHelpButton.className = 'modal-close';
        closeHelpButton.innerHTML = '&times;';
        closeHelpButton.onclick = () => helpModal.remove();

        helpHeader.appendChild(helpTitle);
        helpHeader.appendChild(closeHelpButton);

        const helpBody = document.createElement('div');
        helpBody.className = 'modal-body pw-scrollbar';

        const helpContainer = document.createElement('div');
        helpContainer.className = 'help-container';

        const helpTitleElement = document.createElement('h4');
        helpTitleElement.className = 'help-title';
        helpTitleElement.textContent = '📝 Как добавлять предметы:';

        const helpText = document.createElement('p');
        helpText.className = 'help-text';
        helpText.textContent = 'Для корректной работы автоматического поиска предметов важно точно копировать их названия.';

        const helpImportant = document.createElement('div');
        helpImportant.className = 'help-important';

        const helpSubtitle = document.createElement('h5');
        helpSubtitle.className = 'help-subtitle';
        helpSubtitle.textContent = 'Важно:';

        const helpList = document.createElement('ul');
        helpList.className = 'help-list';

        const desc1 = document.createElement('li');
        desc1.innerHTML = '<strong>Копируйте точные названия предметов из HTML-кода страницы</strong>';
        const desc2 = document.createElement('li');
        desc2.innerHTML = 'Для этого на странице с предметами нажмите <strong>ПКМ → "Исследовать элемент"</strong> (или <strong>"Просмотреть код"</strong>)';
        const desc3 = document.createElement('li');
        desc3.innerHTML = 'Найдите в коде элемент с названием нужного предмета (например, <code>&lt;label&gt;Серебряный камень жребия  x5&lt;/label&gt;</code>)';
        const desc4 = document.createElement('li');
        desc4.innerHTML = 'Скопируйте текст названия <strong>точно</strong> из тега <code>label</code>';
        const desc5 = document.createElement('li');
        desc5.innerHTML = 'При проблемах с поиске проверьте полное совпадение скопированного названия';

        helpList.appendChild(desc1);
        helpList.appendChild(desc2);
        helpList.appendChild(desc3);
        helpList.appendChild(desc4);
        helpList.appendChild(desc5);

        helpImportant.appendChild(helpSubtitle);
        helpImportant.appendChild(helpList);

        helpContainer.appendChild(helpTitleElement);
        helpContainer.appendChild(helpText);
        helpContainer.appendChild(helpImportant);

        const helpHr = document.createElement('hr');
        helpHr.className = 'help-hr';

        const helpCenter = document.createElement('div');
        helpCenter.className = 'help-center';

        const helpFooterText = document.createElement('p');
        helpFooterText.textContent = 'Справка по добавлению предметов для скрипта PW Shards Panel Enhanced';

        helpCenter.appendChild(helpFooterText);

        helpBody.appendChild(helpContainer);
        helpBody.appendChild(helpHr);
        helpBody.appendChild(helpCenter);

        const helpFooter = document.createElement('div');
        helpFooter.className = 'modal-footer';

        const okButton = document.createElement('button');
        okButton.className = 'pw-panel-button primary';
        okButton.textContent = 'Понятно';
        okButton.onclick = () => helpModal.remove();

        helpFooter.appendChild(okButton);

        helpContent.appendChild(helpHeader);
        helpContent.appendChild(helpBody);
        helpContent.appendChild(helpFooter);
        helpModal.appendChild(helpContent);

        document.body.appendChild(helpModal);
        helpModal.classList.add('active');

        // Закрытие по клику вне окна
        helpModal.onclick = (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        };
    }

    // ==========================
    // МОДАЛЬНОЕ ОКНО СПРАВКИ (основное)
    // ==========================
    function showHelpModal() {
        const helpModal = document.createElement('div');
        helpModal.className = 'modal-overlay';
        helpModal.id = 'help-modal';

        const helpContent = document.createElement('div');
        helpContent.className = 'modal-content';

        const helpHeader = document.createElement('div');
        helpHeader.className = 'modal-header';

        const helpTitle = document.createElement('h3');
        helpTitle.className = 'modal-title';
        helpTitle.textContent = 'Справка по скрипту PW Shards Panel Enhanced';

        const closeHelpButton = document.createElement('button');
        closeHelpButton.className = 'modal-close';
        closeHelpButton.innerHTML = '&times;';
        closeHelpButton.onclick = () => helpModal.remove();

        helpHeader.appendChild(helpTitle);
        helpHeader.appendChild(closeHelpButton);

        const helpBody = document.createElement('div');
        helpBody.className = 'modal-body pw-scrollbar';

        // Основные функции
        const helpContainer1 = document.createElement('div');
        helpContainer1.className = 'help-container';

        const helpTitle1 = document.createElement('h4');
        helpTitle1.className = 'help-title';
        helpTitle1.textContent = '📋 Основные функции:';

        const helpList1 = document.createElement('ul');
        helpList1.className = 'help-list';

        const func1 = document.createElement('li');
        func1.innerHTML = '<strong>Автовыбор персонажа</strong> - автоматический выбор персонажа при загрузке страницы';
        const func2 = document.createElement('li');
        func2.innerHTML = '<strong>Группы предметов</strong> - возможность создавать и редактировать группы предметов';
        const func3 = document.createElement('li');
        func3.innerHTML = '<strong>AJAX-передача</strong> - передача предметов без переадресации страницы';
        const func4 = document.createElement('li');
        func4.innerHTML = '<strong>Последовательная передача</strong> - автоматическая передача предметов выбранной категории пакетами по 5 штук (рекомендуется для передачи большого количества подарков)';
        const func5 = document.createElement('li');
        func5.innerHTML = '<strong>Ограничение количества</strong> - настройка максимального количества предметов для последовательной передачи';
        const func6 = document.createElement('li');
        func6.innerHTML = '<strong>Открытие сундуков караванщика</strong> - автоматическое открытие всех сундуков караванщика';

        const func7 = document.createElement('li');
        func7.innerHTML = '<strong>Защита от блокировки чекбоксов 🛡️</strong> - предотвращает автоматическую блокировку чекбоксов подарков [не рекомендуется]';
        const func8 = document.createElement('li');
        func8.innerHTML = '<strong>Принудительная разблокировка 🔓</strong> - мгновенно разблокирует все заблокированные чекбоксы подарков [не рекомендуется]';

        helpList1.appendChild(func1);
        helpList1.appendChild(func2);
        helpList1.appendChild(func3);
        helpList1.appendChild(func4);
        helpList1.appendChild(func5);
        helpList1.appendChild(func6);

        helpList1.appendChild(func7);
        helpList1.appendChild(func8);

        helpContainer1.appendChild(helpTitle1);
        helpContainer1.appendChild(helpList1);

        // Группы предметов
        const helpContainer2 = document.createElement('div');
        helpContainer2.className = 'help-container';

        const helpTitle2 = document.createElement('h4');
        helpTitle2.className = 'help-title';
        helpTitle2.textContent = '🎁 Группы предметов:';

        const helpText2 = document.createElement('p');
        helpText2.className = 'help-text';
        helpText2.textContent = 'Для добавления и редактирования групп предметов используйте кнопку "+" рядом с выпадающим списком.';

        const helpText3 = document.createElement('p');
        helpText3.className = 'help-text';
        helpText3.innerHTML = '<strong>Важно:</strong> При вводе названий предметов будьте внимательны к пробелам!';

        const helpText4 = document.createElement('p');
        helpText4.className = 'help-text';
        helpText4.textContent = 'Например, в строке "Серебряный камень жребия x5" должно быть два пробела между словом "жребия" и "x5" (на момент написания данного скрипта).';

        const helpText5 = document.createElement('p');
        helpText5.className = 'help-text';
        helpText5.textContent = 'Если ввести неправильное количество пробелов, предметы не будут найдены.';

        const helpList2 = document.createElement('ul');
        helpList2.className = 'help-list';

        const tip1 = document.createElement('li');
        tip1.innerHTML = '<strong>Копируйте точные названия предметов из HTML-кода страницы</strong>';
        const tip2 = document.createElement('li');
        tip2.innerHTML = 'Для этого на странице с предметами нажмите <strong>ПКМ → "Исследовать элемент"</strong> (или <strong>"Просмотреть код"</strong>)';
        const tip3 = document.createElement('li');
        tip3.innerHTML = 'Найдите в коде элемент с названием нужного предмета (например, <code>&lt;label&gt;Серебряный камень жребия  x5&lt;/label&gt;</code>)';
        const tip4 = document.createElement('li');
        tip4.innerHTML = 'Скопируйте текст названия <strong>точно</strong> из тега <code>label</code>';
        const tip5 = document.createElement('li');
        tip5.innerHTML = 'При проблемах с поиске проверьте полное совпадение скопированного названия';

        helpList2.appendChild(tip1);
        helpList2.appendChild(tip2);
        helpList2.appendChild(tip3);
        helpList2.appendChild(tip4);
        helpList2.appendChild(tip5);

        helpContainer2.appendChild(helpTitle2);
        helpContainer2.appendChild(helpText2);
        helpContainer2.appendChild(helpText3);
        helpContainer2.appendChild(helpText4);
        helpContainer2.appendChild(helpText5);
        helpContainer2.appendChild(helpList2);

        // Специальные пункты в списке
        const helpContainer3 = document.createElement('div');
        helpContainer3.className = 'help-container';

        const helpTitle3 = document.createElement('h4');
        helpTitle3.className = 'help-title';
        helpTitle3.textContent = '⚡ Специальные пункты в списке:';

        const helpList3 = document.createElement('ul');
        helpList3.className = 'help-list';

        const special1 = document.createElement('li');
        special1.innerHTML = '<strong>Выделять всё</strong> - выделяет любые предметы на странице.';
        const special2 = document.createElement('li');
        special2.innerHTML = '<strong>⚠️ Передать ВСЁ ⚠️</strong> - выделяет <strong>ВСЕ</strong> предметы на странице.';

        helpList3.appendChild(special1);
        helpList3.appendChild(special2);

        helpContainer3.appendChild(helpTitle3);
        helpContainer3.appendChild(helpList3);

        // Открытие сундуков караванщика
        const helpContainer4 = document.createElement('div');
        helpContainer4.className = 'help-container';

        const helpTitle4 = document.createElement('h4');
        helpTitle4.className = 'help-title';
        helpTitle4.textContent = '🎒 Открытие сундуков караванщика:';

        const helpList4 = document.createElement('ul');
        helpList4.className = 'help-list';

        const chest1 = document.createElement('li');
        chest1.innerHTML = '<strong>Автоматический поиск</strong> - скрипт сам найдет все сундуки караванщика на странице по названию блока';
        const chest2 = document.createElement('li');
        chest2.innerHTML = '<strong>Подтверждение</strong> - перед открытием показывается количество найденных сундуков';
        const chest3 = document.createElement('li');
        chest3.innerHTML = '<strong>Автоматическое закрытие</strong> - окна закрываются после получения наград или по таймауту (5 сек)';
        const chest4 = document.createElement('li');
        chest4.innerHTML = '<strong>Перезагрузка</strong> - страница автоматически перезагружается после завершения';

        helpList4.appendChild(chest1);
        helpList4.appendChild(chest2);
        helpList4.appendChild(chest3);
        helpList4.appendChild(chest4);

        const noteBox = document.createElement('div');
        noteBox.className = 'note-box';
        noteBox.innerHTML = '<strong>💡 Примечание:</strong> Для работы функции необходимо разрешить всплывающие окна в браузере для сайта pwonline.ru';

        helpContainer4.appendChild(helpTitle4);
        helpContainer4.appendChild(helpList4);
        helpContainer4.appendChild(noteBox);

        // Настройки задержки открытия сундуков
        const helpContainer5 = document.createElement('div');
        helpContainer5.className = 'help-container';

        const helpTitle5 = document.createElement('h4');
        helpTitle5.className = 'help-title';
        helpTitle5.textContent = '🔧 Настройки задержки открытия сундуков:';

        const helpList5 = document.createElement('ul');
        helpList5.className = 'help-list';

        const delay1 = document.createElement('li');
        delay1.innerHTML = '<strong>Без задержки</strong> - окна открываются сразу одно за другим';
        const delay2 = document.createElement('li');
        delay2.innerHTML = '<strong>Фиксированная задержка</strong> - между открытием окон будет постоянная задержка';
        const delay3 = document.createElement('li');
        delay3.innerHTML = '<strong>Случайная задержка</strong> - между открытием окон будет случайная задержка в указанном диапазоне';

        helpList5.appendChild(delay1);
        helpList5.appendChild(delay2);
        helpList5.appendChild(delay3);

        const helpText6 = document.createElement('p');
        helpText6.className = 'help-text';
        helpText6.textContent = 'Настройки доступны через кнопку ⚙ на панели управления.';

        helpContainer5.appendChild(helpTitle5);
        helpContainer5.appendChild(helpList5);
        helpContainer5.appendChild(helpText6);

        // Настройки последовательной передачи
        const helpContainer6 = document.createElement('div');
        helpContainer6.className = 'help-container';

        const helpTitle6 = document.createElement('h4');
        helpTitle6.className = 'help-title';
        helpTitle6.textContent = '🔧 Настройки последовательной передачи:';

        const helpList6 = document.createElement('ul');
        helpList6.className = 'help-list';

        const seq1 = document.createElement('li');
        seq1.innerHTML = '<strong>Макс. всего</strong> - ограничивает общее количество передаваемых предметов';
        const seq2 = document.createElement('li');
        seq2.innerHTML = '<strong>Перезагрузка после завершения</strong> - автоматически перезагружает страницу после завершения передачи';

        helpList6.appendChild(seq1);
        helpList6.appendChild(seq2);

        const helpText7 = document.createElement('p');
        helpText7.className = 'help-text';
        helpText7.textContent = 'Последовательная передача делит найденные предметы на группы по 5 штук и передает их одну за другой.';

        helpContainer6.appendChild(helpTitle6);
        helpContainer6.appendChild(helpList6);
        helpContainer6.appendChild(helpText7);

        const helpHr = document.createElement('hr');
        helpHr.className = 'help-hr';

        const helpCenter = document.createElement('div');
        helpCenter.className = 'help-center';

        const versionText = document.createElement('p');
        versionText.textContent = 'Версия скрипта: 3.9.3';

        const storageText = document.createElement('p');
        storageText.textContent = 'Скрипт сохраняет настройки в локальное хранилище вашего браузера';

        helpCenter.appendChild(versionText);
        helpCenter.appendChild(storageText);

        helpBody.appendChild(helpContainer1);
        helpBody.appendChild(helpContainer2);
        helpBody.appendChild(helpContainer3);
        helpBody.appendChild(helpContainer4);
        helpBody.appendChild(helpContainer5);
        helpBody.appendChild(helpContainer6);
        helpBody.appendChild(helpHr);
        helpBody.appendChild(helpCenter);

        const helpFooter = document.createElement('div');
        helpFooter.className = 'modal-footer';

        const okButton = document.createElement('button');
        okButton.className = 'pw-panel-button primary';
        okButton.textContent = 'Закрыть';
        okButton.onclick = () => helpModal.remove();

        helpFooter.appendChild(okButton);

        helpContent.appendChild(helpHeader);
        helpContent.appendChild(helpBody);
        helpContent.appendChild(helpFooter);
        helpModal.appendChild(helpContent);

        document.body.appendChild(helpModal);
        helpModal.classList.add('active');

        // Закрытие по клику вне окна
        helpModal.onclick = (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        };
    }

    function createControlButton(text, color) {
        const button = document.createElement('button');
        button.className = 'pw-panel-button';
        button.textContent = text;
        button.style.background = color;
        return button;
    }

    function addNewGroup() {
        const name = prompt('Введите название новой группы:');
        if (name && name.trim()) {
            currentGiftTypes.push({
                name: name.trim(),
                targets: []
            });
            saveGiftTypes();
            updateGiftSelect();
            renderGroupsInModal(document.getElementById('gift-groups-container'));
        }
    }

    function renderGroupsInModal(container) {
        container.innerHTML = '';

        const types = currentGiftTypes.length > 0 ? currentGiftTypes : DEFAULT_GIFT_TYPES;

        types.forEach((group, groupIndex) => {
            const groupElement = createGroupElement(group, groupIndex);
            container.appendChild(groupElement);
        });
    }

    function createGroupElement(group, groupIndex) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'gift-group';

        // Заголовок группы
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';

        const groupTitleContainer = document.createElement('div');
        groupTitleContainer.className = 'group-title';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'group-toggle';
        toggleBtn.innerHTML = '▼';

        const groupNameInput = document.createElement('input');
        groupNameInput.className = 'group-name-input';
        groupNameInput.type = 'text';
        groupNameInput.value = group.name;
        groupNameInput.onchange = () => {
            group.name = groupNameInput.value;
            saveGiftTypes();
            updateGiftSelect();
        };

        groupTitleContainer.appendChild(toggleBtn);
        groupTitleContainer.appendChild(groupNameInput);

        const groupControls = document.createElement('div');
        groupControls.className = 'group-controls';

        const addItemBtn = document.createElement('button');
        addItemBtn.className = 'pw-panel-icon-button blue';
        addItemBtn.innerHTML = '+';
        addItemBtn.title = 'Добавить предмет';
        addItemBtn.style.marginLeft = '10px';
        addItemBtn.onclick = (e) => {
            e.stopPropagation();
            addItemToGroup(groupIndex);
        };

        const deleteGroupBtn = document.createElement('button');
        deleteGroupBtn.className = 'pw-panel-icon-button red';
        deleteGroupBtn.innerHTML = '×';
        deleteGroupBtn.title = 'Удалить группу';
        deleteGroupBtn.style.marginRight = '10px';
        deleteGroupBtn.onclick = (e) => {
            e.stopPropagation();
            deleteGroup(groupIndex);
        };

        groupControls.appendChild(addItemBtn);
        groupControls.appendChild(deleteGroupBtn);

        groupHeader.appendChild(groupTitleContainer);
        groupHeader.appendChild(groupControls);

        // Контейнер для предметов (изначально открыт)
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'group-items';

        // Рендерим предметы в группе
        group.targets.forEach((item, itemIndex) => {
            const itemElement = createItemElement(item, groupIndex, itemIndex);
            itemsContainer.appendChild(itemElement);
        });

        // Обработчик для сворачивания/разворачивания
        let isExpanded = true;
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            isExpanded = !isExpanded;
            itemsContainer.style.display = isExpanded ? 'block' : 'none';
            toggleBtn.innerHTML = isExpanded ? '▼' : '▶';
        };

        groupDiv.appendChild(groupHeader);
        groupDiv.appendChild(itemsContainer);

        return groupDiv;
    }

    function createItemElement(itemText, groupIndex, itemIndex) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-row';

        const itemInput = document.createElement('input');
        itemInput.className = 'item-input';
        itemInput.type = 'text';
        itemInput.value = itemText;
        itemInput.onchange = () => {
            currentGiftTypes[groupIndex].targets[itemIndex] = itemInput.value;
            saveGiftTypes();
        };

        const deleteItemBtn = document.createElement('button');
        deleteItemBtn.className = 'pw-panel-icon-button red';
        deleteItemBtn.innerHTML = '×';
        deleteItemBtn.title = 'Удалить предмет';
        deleteItemBtn.onclick = () => {
            deleteItem(groupIndex, itemIndex);
        };

        itemDiv.appendChild(itemInput);
        itemDiv.appendChild(deleteItemBtn);

        return itemDiv;
    }

    function addItemToGroup(groupIndex) {
        const item = prompt('Введите название предмета:');
        if (item && item.trim()) {
            currentGiftTypes[groupIndex].targets.push(item.trim());
            saveGiftTypes();
            renderGroupsInModal(document.getElementById('gift-groups-container'));
        }
    }

    function deleteGroup(groupIndex) {
        if (confirm('Вы уверены, что хотите удалить эту группу?')) {
            currentGiftTypes.splice(groupIndex, 1);
            saveGiftTypes();
            updateGiftSelect();
            renderGroupsInModal(document.getElementById('gift-groups-container'));
        }
    }

    function deleteItem(groupIndex, itemIndex) {
        currentGiftTypes[groupIndex].targets.splice(itemIndex, 1);
        saveGiftTypes();
        renderGroupsInModal(document.getElementById('gift-groups-container'));
    }

    function saveCurrentGiftTypes() {
        saveGiftTypes();
        showSuccessMessage('Группы предметов сохранены');
    }

    function updateGiftSelect() {
        if (!giftSelect) return;

        const currentTypes = currentGiftTypes.length > 0 ? currentGiftTypes : DEFAULT_GIFT_TYPES;
        const currentValue = giftSelect.value;

        giftSelect.innerHTML = '';

        // Сначала добавляем все обычные группы
        currentTypes.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.name;
            opt.textContent = g.name;
            giftSelect.appendChild(opt);
        });

        // Пункт "Выделять всё" - простой стиль, как у обычных групп
        const selectAllOption = document.createElement('option');
        selectAllOption.value = 'select_all';
        selectAllOption.textContent = 'Выделять всё';
        giftSelect.appendChild(selectAllOption);

        // Добавляем разделитель
        let separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '────────────';
        giftSelect.appendChild(separator);

        // Пункт "Передать всё" - с предупреждающим стилем
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = '⚠️ Передать ВСЕ ⚠️';
        allOption.style.color = '#ff6b6b';
        allOption.style.fontWeight = 'bold';
        allOption.style.marginBottom = '15px';
        giftSelect.appendChild(allOption);

        // Добавляем разделитель
        separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '────────────';
        giftSelect.appendChild(separator);

        // Пытаемся восстановить выбранное значение
        const exists = [...giftSelect.options].find(o => o.value === currentValue);
        if (exists) {
            giftSelect.value = currentValue;
        } else if (giftSelect.options.length > 0) {
            // По умолчанию выбираем первую обычную группу (не специальные пункты)
            const firstRegularOption = [...giftSelect.options].find(o =>
                o.value !== 'select_all' && o.value !== 'all' && !o.disabled
            );
            if (firstRegularOption) {
                giftSelect.value = firstRegularOption.value;
            }
        }
    }

	// ==========================
	// ПРОВЕРКА С ВЫВОДОМ ВЫБРАННОГО И ТЕКУЩЕГО ПЕРСОНАЖА
	// ==========================
	function checkSelectedAndCurrentCharacters() {
		// 1. Получаем выбранного персонажа в панели
		const panelOpt = panelSelect.options[panelSelect.selectedIndex];
		const panelText = panelOpt ? panelOpt.textContent : 'Не выбран';

		// 2. Получаем текущего персонажа на странице
		const shardSelect = document.querySelector('.js-shard');
		const charSelect = document.querySelector('.js-char');

		let currentCharacterText = 'Не определен';

		if (shardSelect && charSelect) {
			// Получаем текст выбранного шарда
			const selectedShardOption = shardSelect.options[shardSelect.selectedIndex];
			const shardText = selectedShardOption ? selectedShardOption.textContent : 'Неизвестный шард';

			// Получаем текст выбранного персонажа
			const selectedCharOption = charSelect.options[charSelect.selectedIndex];
			const charText = selectedCharOption ? selectedCharOption.textContent : 'Неизвестный персонаж';

			currentCharacterText = `${shardText} → ${charText}`;
		}

		// 3. Формируем сообщение
		const message = `Выбрано в панели:\n${panelText}\nshard=${panelOpt?.dataset?.shard || 'N/A'}\nchar=${panelOpt?.value || 'N/A'}\n------------------------------\nУстановлено на странице:\n${currentCharacterText}`;
		alert(message);

	}

    // ==========================
    // ПРИНУДИТЕЛЬНАЯ РАЗБЛОКИРОВКА ЧЕКБОКСОВ ПОДАРКОВ
    // ==========================
    function removeDisabledGiftCheckboxes() {
        const checkboxes = document.querySelectorAll('.item_input_block input[type="checkbox"][name="cart_items[]"][disabled]');
        let count = 0;

        checkboxes.forEach(cb => {
            cb.disabled = false;
            count++;
        });

        if (count > 0) {
            showSuccessMessage(`🔓 Разблокировано ${count} чекбоксов`, 2000);
        } else {
            showSuccessMessage('✅ Заблокированных чекбоксов не найдено', 2000);
        }

        return count;
    }

    // ==========================
    //  ЗАПРЕТ УСТАНОВКИ DISABLED ДЛЯ ЧЕКБОКСОВ ПОДАРКОВ
    // ==========================
    function preventDisabledOnGiftCheckboxes() {
        // Функция для создания наблюдателя за конкретным элементом
        function createObserverForElement(element) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' &&
                        mutation.attributeName === 'disabled' &&
                        element.disabled) {

                        // Мгновенно убираем disabled
                        element.disabled = false;

                        // Опционально: визуальная индикация
                        element.style.outline = '2px solid #4CAF50';
                        setTimeout(() => element.style.outline = '', 500);

                        console.log('🛡️ Предотвращена блокировка чекбокса:', element.id);
                    }
                });
            });

            // Начинаем наблюдение
            observer.observe(element, {
                attributes: true,
                attributeFilter: ['disabled']
            });

            return observer;
        }

        // Функция для обработки всех существующих и новых чекбоксов
        function setupProtection() {
            // Ищем чекбоксы подарков - они находятся в item_input_block и имеют name="cart_items[]"
            const checkboxes = document.querySelectorAll('.item_input_block input[type="checkbox"][name="cart_items[]"]');

            console.log('🔍 Найдено чекбоксов для защиты:', checkboxes.length);

            checkboxes.forEach(checkbox => {
                // Если у элемента уже есть disabled - убираем
                if (checkbox.disabled) {
                    console.log('🔓 Разблокировка чекбокса:', checkbox.id);
                    checkbox.disabled = false;
                }

                // Создаём наблюдателя для этого элемента
                createObserverForElement(checkbox);
            });

            if (checkboxes.length > 0) {
                console.log(`🛡️ Защита от disabled активирована для ${checkboxes.length} чекбоксов`);
            }
        }

        // Наблюдаем за появлением новых чекбоксов на странице
        const bodyObserver = new MutationObserver(function(mutations) {
            let needsSetup = false;

            mutations.forEach(function(mutation) {
                // Проверяем добавленные узлы
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // element node
                        // Если это сам чекбокс
                        if (node.matches && node.matches('.item_input_block input[type="checkbox"][name="cart_items[]"]')) {
                            if (node.disabled) node.disabled = false;
                            createObserverForElement(node);
                            needsSetup = true;
                        }

                        // Проверяем вложенные чекбоксы
                        const nestedCheckboxes = node.querySelectorAll ?
                              node.querySelectorAll('.item_input_block input[type="checkbox"][name="cart_items[]"]') : [];

                        nestedCheckboxes.forEach(checkbox => {
                            if (checkbox.disabled) checkbox.disabled = false;
                            createObserverForElement(checkbox);
                            needsSetup = true;
                        });
                    }
                });
            });

            if (needsSetup) {
                console.log('🔄 Обнаружены новые чекбоксы, защита активирована');
            }
        });

        // Запускаем наблюдение за body
        bodyObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Первоначальная настройка
        setupProtection();

        // Возвращаем функцию для ручного обновления защиты
        return {
            refresh: setupProtection,
            stop: () => bodyObserver.disconnect()
        };
    }

    // ==========================
    // CREATE PANEL
    // ==========================
    function createPanel() {
        // ИЗМЕНЕНО: Проверяем, не страница ли это сундука
        if (isChestPage()) {
            console.log('Страница сундука - панель не создается');
            return;
        }

        // Загружаем группы предметов
        loadGiftTypes();

        // Загружаем настройки задержки сундуков
        loadChestDelaySettings();

        // Основная панель
        panel = document.createElement('div');
        panel.id = 'pw-panel';
        panel.className = 'pw-panel';

        // Добавляем класс текущей темы
        panel.classList.add(`pw-theme-${currentTheme}`);

        // Кнопка скрытия/показа - привязана к краю панели
        toggle = document.createElement('div');
        toggle.id = 'pw-panel-toggle';
        toggle.className = 'pw-panel-toggle';

        // Загружаем сохраненное состояние панели
        let hidden = loadPanelState();

        toggle.onclick = () => {
            hidden = !hidden;

            if (hidden) {
                // Скрываем панель - сдвигаем за правый край
                panel.classList.add('hidden');
                // Кнопка перемещается к правому краю окна
                toggle.classList.add('hidden');
                toggle.textContent = '◀';
            } else {
                // Показываем панель - возвращаем на место
                panel.classList.remove('hidden');
                // Кнопка возвращается к краю панели
                toggle.classList.remove('hidden');
                toggle.textContent = '▶';
            }
            savePanelState(hidden);
        };

        // Применяем сохраненное состояние при загрузке
        if (hidden) {
            panel.classList.add('hidden');
            toggle.classList.add('hidden');
            toggle.textContent = '◀';
        } else {
            toggle.textContent = '▶';
        }

        // Строка 1: Select персонажа
        panelSelect = document.createElement('select');
        panelSelect.className = 'pw-panel-select';
        panelSelect.onchange = saveSelection;

        const settingsButtonContainer = document.createElement('div');
        settingsButtonContainer.className = 'pw-panel-row';

        // Кнопка "Выбор темы"
        const btnTheme = document.createElement('button');
        btnTheme.className = 'pw-panel-icon-button pw-panel-theme-button';
        btnTheme.innerHTML = '☀️';
        btnTheme.title = 'Выбор цветовой темы';
        btnTheme.onclick = toggleTheme;

        // Кнопка "Справка"
        const btnHelp = document.createElement('button');
        btnHelp.className = 'pw-panel-icon-button';
        btnHelp.innerHTML = '❓';
        btnHelp.title = 'Справка по скрипту';
        btnHelp.onclick = showHelpModal;

        settingsButtonContainer.appendChild(panelSelect);
        settingsButtonContainer.appendChild(btnTheme);
        settingsButtonContainer.appendChild(btnHelp);

        panel.appendChild(settingsButtonContainer);

        // Строка 2: Чекбокс автоустановки + кнопки защиты
        const autoContainer = document.createElement('div');
        autoContainer.className = 'auto-container';
        autoContainer.style.display = 'flex';
        autoContainer.style.alignItems = 'center';
        autoContainer.style.justifyContent = 'space-between';
        autoContainer.style.gap = '4px';

        // Левая часть с чекбоксом
        const leftPart = document.createElement('div');
        leftPart.style.display = 'flex';
        leftPart.style.alignItems = 'center';
        leftPart.style.flex = '1';

        autoCheckbox = document.createElement('input');
        autoCheckbox.type = 'checkbox';
        autoCheckbox.id = 'autoInstallCheck';
        autoCheckbox.className = 'pw-panel-checkbox';
        autoCheckbox.checked = localStorage.getItem(STORAGE_AUTOINSTALL) === '1';
        autoCheckbox.onchange = () => localStorage.setItem(STORAGE_AUTOINSTALL, autoCheckbox.checked ? '1' : '0');

        const autoLabel = document.createElement('label');
        autoLabel.textContent = ' Устанавливать автоматически';
        autoLabel.htmlFor = 'autoInstallCheck';
        autoLabel.className = 'pw-panel-label';
        autoLabel.title = 'Автоматически устанавливать выбранного персонажа при загрузке страницы';

        leftPart.appendChild(autoCheckbox);
        leftPart.appendChild(autoLabel);

        // Правая часть с кнопками защиты
        const rightPart = document.createElement('div');
        rightPart.style.display = 'flex';
        rightPart.style.gap = '2px';

        // Кнопка активации защиты
        const btnProtect = document.createElement('button');
        btnProtect.className = 'pw-panel-icon-button';
        btnProtect.style.width = '22px';
        btnProtect.style.height = '22px';
        btnProtect.style.fontSize = '12px';
        btnProtect.style.padding = '0';
        btnProtect.innerHTML = '🛡️';
        btnProtect.title = '[Не рекомендуется] Активировать защиту от блокировки чекбоксов (для отключения перезагрузите страницу)';
        btnProtect.onclick = () => {
            if (window.protection) {
                window.protection.refresh();
            } else {
                window.protection = preventDisabledOnGiftCheckboxes();
            }
            btnProtect.style.background = 'var(--pw-accent-green)';
            setTimeout(() => btnProtect.style.background = '', 500);
        };

        // Кнопка принудительной разблокировки
        const btnUnlock = document.createElement('button');
        btnUnlock.className = 'pw-panel-icon-button';
        btnUnlock.style.width = '22px';
        btnUnlock.style.height = '22px';
        btnUnlock.style.fontSize = '12px';
        btnUnlock.style.padding = '0';
        btnUnlock.innerHTML = '🔓';
        btnUnlock.title = '[Не рекомендуется] Принудительно разблокировать все чекбоксы';
        btnUnlock.onclick = () => {
            const count = removeDisabledGiftCheckboxes();
            btnUnlock.style.background = 'var(--pw-accent-green)';
            setTimeout(() => btnUnlock.style.background = '', 500);
        };

        rightPart.appendChild(btnProtect);
        rightPart.appendChild(btnUnlock);

        autoContainer.appendChild(leftPart);
        autoContainer.appendChild(rightPart);
        panel.appendChild(autoContainer);

        // Строка 3: Кнопка установить
        const applyButtonContainer = document.createElement('div');
        applyButtonContainer.className = 'apply-button-container';

        const btnApply = document.createElement('button');
        btnApply.className = 'pw-panel-button';
        btnApply.textContent = 'Выбрать';
        btnApply.title = 'Установить текущего персонажа как выбранного на сайте';
        btnApply.onclick = applySelected;
        applyButtonContainer.appendChild(btnApply);
        panel.appendChild(applyButtonContainer);

        // Строка 4: Разделитель
        const hr1 = document.createElement('hr');
        hr1.className = 'pw-panel-divider';
        panel.appendChild(hr1);

        // Строка 5: Контейнер для выпадающего списка и кнопки "+"
        const giftSelectContainer = document.createElement('div');
        giftSelectContainer.className = 'pw-panel-container';

        // Выпадающий список типа подарков
        giftSelect = document.createElement('select');
        giftSelect.className = 'pw-panel-select';
        giftSelect.style.flexGrow = '1';

        // Кнопка "+" для редактирования групп
        const addGroupButton = document.createElement('button');
        addGroupButton.className = 'pw-panel-icon-button blue';
        addGroupButton.textContent = '+';
        addGroupButton.title = 'Управление группами предметов';

        // Кнопка для выбора всех предметов выбранной категории
        const selectAllCategoryButton = document.createElement('button');
        selectAllCategoryButton.className = 'pw-panel-icon-button yellow';
        selectAllCategoryButton.innerHTML = '⛶';
        selectAllCategoryButton.title = 'Выделить ВСЕ предметы выбранной категории';
        selectAllCategoryButton.onclick = selectAllCategoryItems;

        // Кнопка для снятия всех выделенных чекбоксов
        const clearAllCheckboxesButton = document.createElement('button');
        clearAllCheckboxesButton.className = 'pw-panel-icon-button red';
        clearAllCheckboxesButton.innerHTML = '☐';
        clearAllCheckboxesButton.title = 'Снять все выделения с чекбоксов';
        clearAllCheckboxesButton.onclick = clearAllCheckboxes;

        giftSelectContainer.appendChild(giftSelect);
        giftSelectContainer.appendChild(addGroupButton);
        giftSelectContainer.appendChild(selectAllCategoryButton);
        giftSelectContainer.appendChild(clearAllCheckboxesButton);
        panel.appendChild(giftSelectContainer);

        // Строка 6: Кнопки "Выбрать", "Передать" и "AJAX передача"
        const giftButtonsContainer = document.createElement('div');
        giftButtonsContainer.className = 'pw-panel-row';

        const btnSelect = document.createElement('button');
        btnSelect.className = 'pw-panel-button';
        btnSelect.textContent = 'Выбрать';
        btnSelect.title = 'Выделяет подходящие предметы (первые 5)';
        btnSelect.onclick = selectGiftItems;

        const btnTransfer = document.createElement('button');
        btnTransfer.className = 'pw-panel-button';
        btnTransfer.textContent = 'Передать';
        btnTransfer.title = 'Передает выделенные предметы';
        btnTransfer.onclick = transferItems;

        // Кнопка AJAX передачи с перезагрузкой
        const btnAjaxTransfer = document.createElement('button');
        btnAjaxTransfer.className = 'pw-panel-button primary';
        btnAjaxTransfer.textContent = 'AJAX+Reload';
        btnAjaxTransfer.title = 'AJAX передача выделенных предметов с перезагрузкой страницы через 2 секунды';
        btnAjaxTransfer.onclick = ajaxTransferWithReload;

        giftButtonsContainer.appendChild(btnSelect);
        giftButtonsContainer.appendChild(btnTransfer);
        giftButtonsContainer.appendChild(btnAjaxTransfer);
        panel.appendChild(giftButtonsContainer);

        // Строка 7: Настройки для последовательной передачи
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'pw-panel-flex';

        // Настройка максимального ОБЩЕГО количества предметов
        const maxTotalItemsContainer = document.createElement('div');
        maxTotalItemsContainer.className = 'max-items-container';

        const maxTotalItemsLabel = document.createElement('label');
        maxTotalItemsLabel.className = 'max-items-label';
        maxTotalItemsLabel.textContent = 'Макс. всего:';

        // Загружаем сохраненное значение или используем значение по умолчанию
        const savedMaxTotalItems = localStorage.getItem(STORAGE_SEQUENTIAL_MAX_TOTAL_ITEMS);
        maxTotalItems = savedMaxTotalItems ? parseInt(savedMaxTotalItems) : DEFAULT_MAX_TOTAL_ITEMS;

        maxTotalItemsInput = document.createElement('input');
        maxTotalItemsInput.className = 'pw-panel-input number';
        maxTotalItemsInput.type = 'number';
        maxTotalItemsInput.min = '1';
        maxTotalItemsInput.max = '100';
        maxTotalItemsInput.value = maxTotalItems;
        maxTotalItemsInput.title = 'Максимальное общее количество предметов для последовательной передачи (1-100)';
        maxTotalItemsInput.onchange = updateMaxTotalItemsFromInput;

        maxTotalItemsContainer.appendChild(maxTotalItemsLabel);
        maxTotalItemsContainer.appendChild(maxTotalItemsInput);

        // Чекбокс для перезагрузки после последовательной передачи
        const reloadContainer = document.createElement('div');
        reloadContainer.className = 'reload-container';

        sequentialReloadCheckbox = document.createElement('input');
        sequentialReloadCheckbox.type = 'checkbox';
        sequentialReloadCheckbox.id = 'sequentialReloadCheck';
        sequentialReloadCheckbox.className = 'pw-panel-checkbox';
        const savedReload = localStorage.getItem(STORAGE_SEQUENTIAL_RELOAD);
        sequentialReloadCheckbox.checked = savedReload === '1';
        shouldReloadAfterSequential = sequentialReloadCheckbox.checked;
        sequentialReloadCheckbox.onchange = () => {
            shouldReloadAfterSequential = sequentialReloadCheckbox.checked;
            localStorage.setItem(STORAGE_SEQUENTIAL_RELOAD, shouldReloadAfterSequential ? '1' : '0');
        };

        const reloadLabel = document.createElement('label');
        reloadLabel.textContent = ' Перезагрузка после завершения';
        reloadLabel.htmlFor = 'sequentialReloadCheck';
        reloadLabel.className = 'pw-panel-label reload-label';
        reloadLabel.title = 'Перезагрузить страницу после завершения передачи';

        reloadContainer.appendChild(sequentialReloadCheckbox);
        reloadContainer.appendChild(reloadLabel);

        settingsContainer.appendChild(maxTotalItemsContainer);
        settingsContainer.appendChild(reloadContainer);
        panel.appendChild(settingsContainer);

        // Строка 8: Кнопка "Последовательная AJAX передача"
        const sequentialContainer = document.createElement('div');
        sequentialContainer.className = 'sequential-container';

        const btnSequential = document.createElement('button');
        btnSequential.className = 'pw-panel-button primary btn-sequential';
        btnSequential.textContent = 'Последовательная AJAX передача';
        btnSequential.title = 'Находит предметы выбранной группы и передает их пакетами по 5 штук (с ограничением общего количества)';
        btnSequential.onclick = sequentialAjaxTransfer;
        sequentialContainer.appendChild(btnSequential);

        panel.appendChild(sequentialContainer);

        // Строка 9: Разделитель
        const hr2 = document.createElement('hr');
        hr2.className = 'pw-panel-divider';
        panel.appendChild(hr2);

        // Строка 10: Кнопки "Проверка", "Настройки", "Открыть сундуки караванщика" и "Справка"
        const checkButtonContainer = document.createElement('div');
        checkButtonContainer.className = 'pw-panel-row';

        // Кнопка "Проверка"
        const btnCheck = document.createElement('button');
        btnCheck.className = 'pw-panel-button btn-check';
        btnCheck.textContent = 'Проверка';
        btnCheck.title = 'Выводит информацию о текущем выбранном персонаже';
        btnCheck.onclick = checkSelectedAndCurrentCharacters;

        // Кнопка "Сундуки (караван)"
        const btnChests = document.createElement('button');
        btnChests.className = 'pw-panel-button purple btn-chests';
        btnChests.textContent = 'Сундуки (караван)';
        btnChests.title = 'Открыть сундуки караванщика';
        btnChests.onclick = openCaravanChests;
        // Кнопка "Настройки"

        const btnSettings = document.createElement('button');
        btnSettings.className = 'pw-panel-icon-button';
        btnSettings.innerHTML = '⚙';
        btnSettings.title = 'Настройки задержки открытия сундуков';
        btnSettings.onclick = showChestDelaySettingsModal;

        checkButtonContainer.appendChild(btnCheck);
        checkButtonContainer.appendChild(btnChests);
        checkButtonContainer.appendChild(btnSettings);
        panel.appendChild(checkButtonContainer);

        // Добавляем элементы на страницу в правильном порядке
        document.body.appendChild(panel);
        document.body.appendChild(toggle);

        // Создаем модальное окно для управления группами
        const { modal, groupsContainer } = createGiftTypesModal();

        // Обработчик для кнопки "+"
        addGroupButton.onclick = () => {
            renderGroupsInModal(groupsContainer);
            modal.classList.add('active');
        };

        // Инициализируем выпадающий список
        updateGiftSelect();
    }

    // ==========================
    // INIT
    // ==========================
    // Создаем панель только если это не страница сундука
    if (!isChestPage()) {
        loadTheme();
        createPanel();
        updateThemeButtonIcon(currentTheme);
        waitForShards();
    }

})();