import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Text } from 'src/ui/text';
import { Separator } from 'src/ui/separator';

import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	OptionType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	onChangeArticleState: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	onChangeArticleState,
}: ArticleParamsFormProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const handleToggle = () => {
		setIsSidebarOpen((prev) => !prev);
	};
	const asideRef = useRef<HTMLElement | null>(null);
	const arrowButtonRef = useRef<HTMLDivElement | null>(null);
	const [formState, setFormState] = useState(defaultArticleState);
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onChangeArticleState(formState);
	};
	const handleReset = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormState(defaultArticleState);
		onChangeArticleState(defaultArticleState);
	};
	const handleFieldChange =
		(field: keyof ArticleStateType) => (selected: OptionType) => {
			setFormState((prevState) => ({
				...prevState,
				[field]: selected,
			}));
		};

	useEffect(() => {
		if (!isSidebarOpen) {
			return;
		}

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			const isClickInsideAside = asideRef.current?.contains(target);
			const isClickOnArrowButton = arrowButtonRef.current?.contains(target);
			if (!isClickInsideAside && !isClickOnArrowButton) {
				setIsSidebarOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isSidebarOpen]);

	return (
		<>
			<div ref={arrowButtonRef}>
				<ArrowButton isOpen={isSidebarOpen} onClick={handleToggle} />
			</div>
			<aside
				ref={asideRef}
				className={clsx(
					styles.container,
					isSidebarOpen && styles.container_open
				)}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={handleFieldChange('fontFamilyOption')}
					/>

					<RadioGroup
						name='fontSize'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={handleFieldChange('fontSizeOption')}
					/>

					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={handleFieldChange('fontColor')}
					/>

					<Separator />

					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={handleFieldChange('backgroundColor')}
					/>

					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={handleFieldChange('contentWidth')}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
