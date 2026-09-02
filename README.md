-- [[ TẢI RAYFIELD ]]
local Rayfield = loadstring(game:HttpGet('https://sirius.menu/rayfield'))()

-- [[ CỬA SỔ CHÍNH ]]
local Window = Rayfield:CreateWindow({
   Name = "🍋 MENU BÁN CHANH V2.550",
   Icon = 0,
   LoadingTitle = "Đang tải...",
   LoadingSubtitle = "by Assistant",
   ConfigurationSaving = { Enabled = false },
   Discord = { Enabled = false },
   KeySystem = false
})

-- SERVICES
local Players = game:GetService("Players")
local Player = Players.LocalPlayer
local Character = Player.Character or Player.CharacterAdded:Wait()
local RootPart = Character:WaitForChild("HumanoidRootPart")
local Workspace = game:GetService("Workspace")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- STATE
local _G_AutoUpgrade = false
local _G_AutoHarvest = false
local _G_AutoRedeem = false
local _G_AutoClickLemonStand = false
local _G_AutoBuild = false

-- ============================
-- HÀM LẤY TẤT CẢ TYCOON TRONG WORKSPACE (Tycoon1-10)
-- ============================
local function getAllTycoons()
    local tycoons = {}
    for _, obj in pairs(Workspace:GetChildren()) do
        if obj:IsA("Model") and obj.Name:find("Tycoon") then
            table.insert(tycoons, obj)
        end
    end
    return tycoons
end

-- ============================
-- HÀM TÌM REMOTE NÂNG CẤP TOÀN GAME
-- ============================
local upgradeKeywords = {"LemonDash", "Lemon Stand", "Lemon Depot", "Lemon Trading"}

local function scanUpgradeRemotes()
    local remotes = {}
    for _, v in pairs(game:GetDescendants()) do
        if v:IsA("RemoteFunction") and v.Name == "Upgrade" then
            local path = v:GetFullName()
            for _, keyword in ipairs(upgradeKeywords) do
                if path:find(keyword, 1, true) then
                    table.insert(remotes, v)
                    break
                end
            end
        end
    end
    return remotes
end

local function safeInvokeUpgrade(remote)
    if not remote then return end
    pcall(function()
        remote:InvokeServer(1)
    end)
end

-- ============================
-- HÀM DỊCH CHUYỂN TỨC THÌ
-- ============================
local function instantTeleport(pos)
    if not RootPart then return end
    RootPart.CFrame = CFrame.new(pos)
end

-- ============================
-- HÀM TÌM QUẢ "Fruit" CHỈ TRONG LemonTree
-- ============================
local function FindFruitsInLemonTrees()
    local fruits = {}
    for _, v in pairs(Workspace:GetDescendants()) do
        if v:IsA("BasePart") and v.Name == "Fruit" and v.Parent then
            local parentModel = v:FindFirstAncestor("LemonTree")
            if parentModel and parentModel:IsA("Model") and parentModel.Name == "LemonTree" then
                table.insert(fruits, v)
            end
        end
    end
    return fruits
end

-- ============================
-- HÀM TÌM CLICK DETECTOR TRONG FRUIT
-- ============================
local function FindClickDetector(fruit)
    local clickPart = fruit:FindFirstChild("ClickFruitPart")
    if clickPart then
        local clickDetector = clickPart:FindFirstChildWhichIsA("ClickDetector")
        if clickDetector then
            return clickDetector
        end
    end
    return fruit:FindFirstChildWhichIsA("ClickDetector")
end

-- ============================
-- HÀM CLICK QUẢ
-- ============================
local function ClickFruit(fruit)
    local clickDetector = FindClickDetector(fruit)
    if not clickDetector then return false end

    if fireclickdetector then
        local success = pcall(function()
            fireclickdetector(clickDetector)
        end)
        if success then return true end
    end

    if clickDetector.MouseClick then
        local success = pcall(function()
            firesignal(clickDetector.MouseClick)
        end)
        if success then return true end
    end

    local core = ReplicatedStorage:FindFirstChild("Core")
    if core then
        local remoteSignal = core:FindFirstChild("RemoteSignal")
        if remoteSignal then
            local clickRemote = remoteSignal:FindFirstChild("ClickFruitService.Clicked")
            if clickRemote then
                local RecipientID = 8.8950749994572
                if clickRemote:IsA("RemoteEvent") then
                    return pcall(function() clickRemote:FireServer(RecipientID, fruit.Position, false) end)
                elseif clickRemote:IsA("RemoteFunction") then
                    return pcall(function() clickRemote:InvokeServer(RecipientID, fruit.Position, false) end)
                end
            end
        end
    end

    return false
end

-- ============================
-- HÀM HÁI QUẢ MỘT VÒNG
-- ============================
local function HarvestOnce()
    local fruits = FindFruitsInLemonTrees()
    if #fruits == 0 then return false end

    for _, fruit in ipairs(fruits) do
        if not _G_AutoHarvest then break end
        if fruit and fruit.Parent then
            instantTeleport(fruit.Position)
            task.wait(0.02)

            ClickFruit(fruit)

            local waitTime = 0
            while fruit.Parent and waitTime < 0.2 do
                task.wait(0.02)
                waitTime = waitTime + 0.02
            end

            task.wait(0.02)
        end
    end
    return true
end

-- ============================
-- HÀM NHẶT BAO TIỀN (DropService.Redeem)
-- ============================
local function CollectMoneyOnce()
    pcall(function()
        local core = ReplicatedStorage:FindFirstChild("Core")
        if core then
            local remoteRequest = core:FindFirstChild("RemoteRequest")
            if remoteRequest then
                local redeemRemote = remoteRequest:FindFirstChild("DropService.Redeem")
                if redeemRemote and redeemRemote:IsA("RemoteFunction") then
                    local randomNumber = math.random(1, 1500)
                    redeemRemote:InvokeServer(tostring(randomNumber))
                end
            end
        end
    end)
end

-- ============================
-- HÀM AUTO CLICK LEMONSTAND (WakeIncomeStream)
-- ============================
local function ClickLemonStandOnce()
    local tycoons = getAllTycoons()
    for _, tycoon in ipairs(tycoons) do
        local remotes = tycoon:FindFirstChild("Remotes")
        if remotes then
            local wakeRemote = remotes:FindFirstChild("WakeIncomeStream")
            if wakeRemote and wakeRemote:IsA("RemoteFunction") then
                pcall(function()
                    wakeRemote:InvokeServer("LemonStand")
                end)
            end
        end
    end
end

-- ============================
-- HÀM TỰ ĐỘNG XÂY DỰNG NHÀ (Purchase)
-- ============================
local function BuildHouseOnce()
    local tycoons = getAllTycoons()
    for _, tycoon in ipairs(tycoons) do
        local purchases = tycoon:FindFirstChild("Purchases")
        if purchases then
            local lemonStandFolder = purchases:FindFirstChild("Lemon Stand")
            if lemonStandFolder then
                local buttons = lemonStandFolder:FindFirstChild("Buttons")
                if buttons then
                    local lemonStandButton = buttons:FindFirstChild("Lemon Stand")
                    if lemonStandButton then
                        local purchaseRemote = lemonStandButton:FindFirstChild("Purchase")
                        if purchaseRemote and purchaseRemote:IsA("RemoteFunction") then
                            pcall(function()
                                purchaseRemote:InvokeServer(false, false)
                            end)
                        end
                    end
                end
            end
        end
    end
end

-- ============================
-- TAB FARM
-- ============================
local FarmTab = Window:CreateTab("Farm", 4483362458)

FarmTab:CreateParagraph({
    Title = "⚙️ Tự động nâng cấp",
    Content = "Bật để tự động nâng cấp LemonDash, Lemon Stand, Lemon Depot và Lemon Trading (quét RemoteFunction toàn bộ game)."
})

FarmTab:CreateToggle({
    Name = "Nâng cấp",
    CurrentValue = false,
    Flag = "ToggleUpgrade",
    Callback = function(Value)
        _G_AutoUpgrade = Value
        if _G_AutoUpgrade then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động nâng cấp!", Duration = 3})
            task.spawn(function()
                local upgradeRemotes = scanUpgradeRemotes()
                if #upgradeRemotes == 0 then
                    Rayfield:Notify({Title = "⚠️", Content = "Không tìm thấy Remote nâng cấp nào!", Duration = 3})
                    _G_AutoUpgrade = false
                    Rayfield:SetToggle("ToggleUpgrade", false)
                    return
                end

                local lastRescan = tick()
                while _G_AutoUpgrade do
                    for _, remote in ipairs(upgradeRemotes) do
                        safeInvokeUpgrade(remote)
                        task.wait(0.01)
                    end

                    if tick() - lastRescan > 5 then
                        upgradeRemotes = scanUpgradeRemotes()
                        lastRescan = tick()
                    end

                    task.wait(0.05)
                end
                Rayfield:Notify({Title = "⏹️", Content = "Đã dừng tự động nâng cấp!", Duration = 3})
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã tắt tự động nâng cấp!", Duration = 3})
        end
    end
})

-- Toggle xây dựng nhà
FarmTab:CreateToggle({
    Name = "Tự động xây dựng nhà",
    CurrentValue = false,
    Flag = "ToggleBuildHouse",
    Callback = function(Value)
        _G_AutoBuild = Value
        if _G_AutoBuild then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động xây dựng nhà!", Duration = 3})
            task.spawn(function()
                while _G_AutoBuild do
                    BuildHouseOnce()
                    task.wait(0.1) -- mỗi 0.1 giây
                end
                Rayfield:Notify({Title = "⏹️", Content = "Đã dừng tự động xây dựng nhà!", Duration = 3})
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã tắt tự động xây dựng nhà!", Duration = 3})
        end
    end
})

-- ============================
-- TAB AUTO HARVEST
-- ============================
local HarvestTab = Window:CreateTab("Auto Harvest", 4483362458)

HarvestTab:CreateParagraph({
    Title = "🍋 Tự động hái quả",
    Content = "Bật để tự động dịch chuyển nhanh và click tất cả quả Fruit trong LemonTree."
})

HarvestTab:CreateToggle({
    Name = "Tự động hái quả",
    CurrentValue = false,
    Flag = "ToggleHarvest",
    Callback = function(Value)
        _G_AutoHarvest = Value
        if _G_AutoHarvest then
            Rayfield:Notify({Title = "✅", Content = "Đã bật tự động hái quả!", Duration = 3})
            task.spawn(function()
                while _G_AutoHarvest do
                    local harvested = HarvestOnce()
                    if not harvested then
                        task.wait(0.5)
                    else
                        task.wait(0.2)
                    end
                end
                Rayfield:Notify({Title = "⏹️", Content = "Đã dừng tự động hái quả!", Duration = 3})
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã tắt tự động hái quả!", Duration = 3})
        end
    end
})

-- Toggle Nhặt bao tiền
HarvestTab:CreateToggle({
    Name = "Nhặt bao tiền",
    CurrentValue = false,
    Flag = "ToggleCollectMoney",
    Callback = function(Value)
        _G_AutoRedeem = Value
        if _G_AutoRedeem then
            Rayfield:Notify({Title = "✅", Content = "Đã bật nhặt bao tiền (1-1500)!", Duration = 3})
            task.spawn(function()
                while _G_AutoRedeem do
                    CollectMoneyOnce()
                    task.wait(0.01)
                end
                Rayfield:Notify({Title = "⏹️", Content = "Đã dừng nhặt bao tiền!", Duration = 3})
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã tắt nhặt bao tiền!", Duration = 3})
        end
    end
})

-- ============================
-- TAB CLICK
-- ============================
local ClickTab = Window:CreateTab("Click", 4483362458)

ClickTab:CreateParagraph({
    Title = "🖱️ Auto Click LemonStand",
    Content = "Bật để tự động gửi WakeIncomeStream với 'LemonStand' mỗi 0.1 giây trên tất cả Tycoon."
})

ClickTab:CreateToggle({
    Name = "Auto Click LemonStand",
    CurrentValue = false,
    Flag = "ToggleClickLemonStand",
    Callback = function(Value)
        _G_AutoClickLemonStand = Value
        if _G_AutoClickLemonStand then
            Rayfield:Notify({Title = "✅", Content = "Đã bật Auto Click LemonStand!", Duration = 3})
            task.spawn(function()
                while _G_AutoClickLemonStand do
                    ClickLemonStandOnce()
                    task.wait(0.1)
                end
                Rayfield:Notify({Title = "⏹️", Content = "Đã dừng Auto Click LemonStand!", Duration = 3})
            end)
        else
            Rayfield:Notify({Title = "⏹️", Content = "Đã tắt Auto Click LemonStand!", Duration = 3})
        end
    end
})

-- Thông báo khởi tạo
Rayfield:Notify({Title = "🍋", Content = "MENU BÁN CHANH V2.550 đã sẵn sàng!", Duration = 3})
