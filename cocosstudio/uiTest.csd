<GameProjectFile>
  <PropertyGroup Type="Layer" Name="uiTest" ID="dbdc5d21-b033-4f6a-8dcd-1db25eebe1a8" Version="2.3.2.3" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="15" Speed="1.0000" ActivedAnimationName="rotate">
        <Timeline ActionTag="1409772687" Property="Position">
          <PointFrame FrameIndex="0" X="132.5809" Y="134.5849">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="15" X="245.0000" Y="169.0000">
            <EasingData Type="2" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="1409772687" Property="Scale">
          <ScaleFrame FrameIndex="0" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="1.0000" Y="1.0000">
            <EasingData Type="2" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="15" X="0.4444" Y="0.3846">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="1409772687" Property="RotationSkew">
          <ScaleFrame FrameIndex="0" X="0.0000" Y="-0.0026">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="360.0000" Y="359.9980">
            <EasingData Type="2" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="15" X="360.0000" Y="359.9961">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="rotate" StartIndex="0" EndIndex="15">
          <RenderColor A="255" R="112" G="128" B="144" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Layer" Tag="23" ctype="GameLayerObjectData">
        <Size X="256.0000" Y="256.0000" />
        <Children>
          <AbstractNodeData Name="hall_pop_window_bg_1" ActionTag="1409772687" Tag="24" FrameEvent="animcall" RotationSkewY="-0.0026" IconVisible="False" LeftMargin="87.5809" RightMargin="78.4191" TopMargin="43.4151" BottomMargin="56.5849" ctype="SpriteObjectData">
            <Size X="90.0000" Y="156.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="132.5809" Y="134.5849" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5179" Y="0.5257" />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hall_pop_window_bg.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameProjectFile>