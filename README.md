# PagerMemory - REACT component

레이아웃을 페이징하는 React 컴포넌트입니다.  
Android의 ViewPager와 비슷하게 동작합니다.  
&nbsp;  
각 Page는 PagerMemory 컴포넌트의 자식(children) 형태로 전달되며, 동적으로 페이지의 수를 변경(페이지의 추가 및 제거)가 가능합니다.  
모바일 플랫폼의 경우 Swipe하여 페이지를 전환하거나, PagerController를 사용하여 함수로 선택된 페이지를 변경할 수도 있습니다.  
무한 페이징같은 것도 가능하고 lazy loading을 이용할 수도 있어요!!  
&nbsp;  
자세한 내용은 아래를 참고해주세요!!

# Usage

가장 간단한 형태로는 다음과 같이 사용할 수 있습니다.

```jsx
<PagerMemory
    dimension={{width: "100%", height: "50%"}}
    orientation="horizontal">

    <div>First Page. Some awesome content will go here.</div>
    <div>Second Page. Some secondary content will go here.</div>
    <div>Third Page. Last content will go here.</div>
    <!-- ... -->

</PagerMemory>
```

위처럼 PagerMemory 컴포넌트를 만들고 자식으로 각 페이지가 될 div 들을 배치합니다.  
당연히 JSX.Element[] 를 사용해서 동적으로 페이지의 수를 조절할 수 있도록 전달해줘도 무방합니다.

## Properties

PagerMemory에 전달해야 할 필수 prop들은 다음과 같습니다:

- `dimension: [CSS.Property.Width, CSS.Property.Height]`
    - Pager가 갖게될 크기입니다. CSS.Property.Width / CSS.Property.Height 의 값 형식을 따라가므로 그냥 CSS에 값을 입력하듯이 주되, 주의할 점은 반드시 정확한 크기를
      가져야하기 때문에 auto, 부모의 크기가 정해지지 않은 상태에서 %단위 사용 등은 비허용됩니다.
- `orientation: "horizontal" | "vertical"`
    - Pager가 수평 형태인지 수직 형태인지 정합니다.

&nbsp;  
PagerMemory에 전달 가능한 선택적 prop들은 다음과 같습니다:

- `controller?: PagerController`
    - Pager를 스크립트를 사용해 컨트롤하고싶을 경우 사용합니다.
      `generatePagerController()` 를 임포트 후 사용하여 `PagerController`를 만들고 그것을 이 prop에 전달하며, 첫 렌더링 이후부터 이 컨트롤러를 사용할 수 있습니다.
- `listeners?: { select?: ((position: number) => void)[], scroll?: ((value: number) => void)[] }`
    - 페이지가 변경되거나 사용자가 Pager를 swipe할 때 호출될 함수를 배열 형태로 전달합니다.
- `lockPager?: boolean`
    - Pager를 잠그고 어떠한 방법으로도 페이지를 변경할 수 없도록 하려면 해당 prop에 `true`를 전달합니다.
      **유저의 입력만 차단하고 controller를 이용한 페이지 이동은 허용하려면 pointerEvents prop을 사용해주세요**
- `overscroll?: boolean`
    - Pager가 overscroll을 할 수 있도록 허용하려면 해당 prop에 `true`를 전달합니다.
- `pointerEvents?: boolean`
    - 사용자가 마우스 혹은 터치를 사용해 페이지를 변경할 수 있도록 허용하려면 해당 prop에 `true`를 전달합니다.
- `transitionMethod?: PageTransitionMethod`
    - Pager의 Page Transition Behaviour를 커스텀하고 싶다면 해당 prop를 사용합니다. 자세한 사항은 아래쪽 영역을 참고해주세요!!

## PagerController

`props.controller`를 통해 전달되는 오브젝트는 PagerController 라는 타입을 가진 오브젝트입니다.

```typescript jsx
const pager = useMemo(() => generatePagerController(), []);

return <div>
    <PagerMemory
        controller={pager}
        dimension={{width: "100%", height: "50%"}}
        orientation="horizontal">

        <!-- ... -->
    </PagerMemory>

    <div onClick={() => pager.previous(true)}>이전 페이지</div>
    <div onClick={() => pager.next(true)}>다음 페이지</div>
    <div onClick={() => pager.select(2, true)}>3페이지 선택</div>
</div>;
```

위의 예시처럼 `generatePagerController()` 함수를 사용하여 오브젝트를 만들고 그것을 Pager의 `controller` prop에 전달하면, 첫 렌더링 이후부터 만든 오브젝트를 통해 다음 함수를
사용할 수 있게 됩니다:

- `select: (target: number, animate: boolean) => void`
    - 지정된 페이지(`target`)를 선택합니다. 이 때 animation을 사용하려면 `animate` 인수에 `true`를, 사용하지 않으려면 `false`를 전달합니다.
- `next: (animate: boolean) => void`
    - 현재 선택된 페이지를 기준으로 바로 다음 페이지를 선택합니다. `animate` 인수는 select 함수에서의 그것과 같은 의미입니다.
- `previous: (animate: boolean) => void`
    - 현재 선택된 페이지를 기준으로 바로 이전 페이지를 선택합니다. `animate` 인수는 select 함수에서의 그것과 같은 의미입니다.

## PageTransitionMethod

기본적으로, Pager의 `transitionMethod` prop을 사용하지 않으면 `DefaultPageTransitionMethod`가 사용됩니다.  
그런데 해당 Scroll Behaviour가 별로 마음에 들지 않는다면, `PageTransitionMethod`라는 추상 클래스를 확장하여 새로운 ScrollBehaviour를 만들어 사용할 수 있습니다.  
&nbsp;  
아래는 이미 정의되어있는 `ZoomOutTransitionMethod`의 구현 예시입니다(동작이 궁금하면 이 코드 아래의 내용을 참고해주세요!):

```typescript
class ZoomOutPageTransitionMethod extends PageTransitionMethod {

    position(data: PageTransitionData, pageIndex: number): string {
        return (pageIndex * 100) + "%";
    }

    scroll(data: PageTransitionData, value: number): number {
        let positionIndex: keyof AbsoluteDimension = (data.orientation === "vertical") ? "height" : "width";
        let floatArea = value - Math.floor(value);
        if (data.overscroll && value < 1) {
            return data.dimension[positionIndex] * (Math.floor(value) + (9 / 10 + floatArea / 10));
        } else if (data.overscroll && value > data.pageLength) {
            return data.dimension[positionIndex] * (Math.floor(value) + 1 / 10 * floatArea);
        } else {
            return data.dimension[positionIndex] * (Math.floor(value) +
                ((floatArea >= 0.5) ? ((-8) * Math.pow(floatArea - 1, 4) + 1) : 8 * Math.pow(floatArea, 4)));
        }
    }

    translate(data: PageTransitionData, value: number, pageIndex: number): string {
        return "0%";
    }

    opacity(data: PageTransitionData, value: number, pageIndex: number): number {
        let floatArea = value - Math.floor(value);

        let validPageMin = ((data.overscroll) ? 1 : 0);
        let validPageMax = ((data.overscroll) ? data.pageLength : data.pageLength - 1);

        if (value >= validPageMin && value <= validPageMax) {
            if (floatArea < 0.3) {
                return 1 - floatArea * 1.5;
            } else if (floatArea < 0.7) {
                return 0.55;
            } else {
                return 0.55 + (floatArea - 0.7) * 1.5;
            }
        } else if (value < validPageMin) {
            return 0.55 + (floatArea - 0.7) * 1.5;
        } else if (value > validPageMax) {
            return 1 - floatArea * 1.5;
        } else {
            // NOT HAPPENED
            return 0;
        }
    }

    scale(data: PageTransitionData, value: number, pageIndex: number): number {
        let floatArea = value - Math.floor(value);
        if (floatArea < 0.2) {
            return 1 - floatArea / 4;
        } else if (floatArea < 0.8) {
            return 0.95;
        } else {
            return 0.95 + (floatArea - 0.8) / 4;
        }
    }
}
```

`PageTransitionMethod`가 가진 추상 함수들은 다음과 같습니다:

- `position: (data: PageTransitionData, pageIndex: number) => string`
    - pageIndex번째 페이지가 가질, CSS 단위를 포함한 초기 위치를 지정합니다. 지정하지 않으면("0"을 리턴하면) 모든 페이지가 같은 위치에 정확히 겹쳐있도록 배치됩니다.
- `scroll: (data: PageTransitionData, value: number) => number`
    - 페이지가 스크롤될 때 Pager root element의 `scrollLeft`(orientation이 vertical일 경우 `scrollTop`)를 지정합니다.
- `translate: (data: PageTransitionData, value: number, pageIndex: number) => string`
    - 페이지가 스크롤될 때 pageIndex번째 페이지가 가질 transform 스타일 중 translate 의 값을 정합니다. 반드시 단위를 포함해야합니다.
- `opacity: (data: PageTransitionData, value: number, pageIndex: number) => number`
    - 페이지가 스크롤될 때 pageIndex번째 페이지가 가질 opacity 스타일의 값을 정합니다.
- `scale: (data: PageTransitionData, value: number, pageIndex: number) => number`
    - 페이지가 스크롤될 때 pageIndex번째 페이지가 가질 transform 스타일 중 scale의 값을 정합니다.

추상 함수에 전달되는 각 인수들은 다음과 같은 정보를 포함합니다:

- `data: PageTransitionData`: 추상 함수를 구체화하는데 필요한 정보를 갖는 오브젝트로, 다음과 같은 값들을 가집니다:
    - `orientation: "horizontal" | "vertical"`: Pager의 형태
    - `dimension: { width: number, height: number }`: Pager의 절대 크기(단위: px)
    - `overscroll: boolean`: props.overscroll의 값
    - `pageLength: number`: 전체 **유효한** 페이지의 갯수
- `value: number`: 실수 값으로 다음과 같습니다:
    - `props.overscroll`이 `true` 일 경우
        - 0부터, Pager의 자식으로 전달한 엘리먼트의 갯수 + 1 까지의 값(페이지가 총 5개 라면 [0, 6] 범위 내의 값)
    - `props.overscroll`이 `false` 일 경우
        - 0부터, Pager의 자식으로 전달한 엘리먼트의 갯수 - 1 까지의 값(페이지가 총 5개라면 [0, 4] 범위 내의 값)
    - **`props.overscroll`에 따라 `value` 값이 다른 이유는 `overscroll`이 `true`일 경우 Pager element 안에 렌더링되는 자식의 수가 페이지들의 앞과 뒤에 하나씩
      총 2개가 늘어나기 때문입니다. `overscroll`이 `true`일 때 첫 페이지의 `value`는 `1`이 됩니다.**
- `pageIndex: number`: `value`의 정수버전입니다. 마찬가지로 props.overscroll에 의해 다른 값을 가집니다.

&nbsp;  
추상 클래스의 확장이 끝났다면 다음과 같이 prop에 전달하여 사용합니다:

```typescript jsx
const transitionMethod = useMemo(() => new ZoomOutPageTransitionMethod(), []);

return (<div>
    <PagerMemory
        dimension={{width: "100%", height: "50%"}}
        orientation="horizontal"
        transitionMethod={transitionMethod}>

        <!-- ... -->

    </PagerMemory>
</div>);
```

## 주의해야할 사항

- 데스크탑 환경에서 pointerEvents prop을 따로 설정하지 않았거나 true로 설정했을 경우 각 Pager 아이템들의 스타일에 `user-select: none` 가 포함되어있어야할 수 있습니다.
- 위의 사항과 반대로, Pager 아이템의 각 내용을 드레그로 선택할 수 있게 하려면 pointerEvents prop을 false로 설정해야할 수 있습니다.
- Chrome에 최적화되어있습니다. IE가 곧 죽을 예정이고(??) 해서... 일단 Chrome에서만 테스트되어있습니다.